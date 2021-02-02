/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import * as React from 'react'
import { deviceColumnDefs, checkboxColumn, defaultDeviceGridProps } from './deviceGridConfig'

import { isFunc } from '../shared/Utilities'

// Below 3 imports to support Localization
import { translateColumnDefs } from "../shared/Methods";
import { PcsGrid } from '../shared/pcsGrid/PcsGrid';
import { HttpClient } from '../services/HttpClient';
import { DomainContext } from '../shared/context/BasicContextProvider';

import { library } from "@fortawesome/fontawesome-svg-core";
import * as Icons from "@fortawesome/free-solid-svg-icons";
import SnackBar from '../shared/SnackBar';

const iconList = Object.keys(Icons)
    .filter((key) => key !== "fas" && key !== "prefix")
    .map((icon) => Icons[icon]);
library.add(...iconList);


interface gridStates {
    columnDefs: any,
    rowData: any,
    rowSelection: any,
    autoGroupColumnDef: any,
    softSelectedDevice: any,
    showNotification: boolean
}

export interface gridProps {
    deviceId: string;
    mpsServer: string;
    getSelectedDevices?: any;
    selectedDevices?: any;
    filter?: string;
}

export class DeviceGrid extends React.Component<gridProps, gridStates>{
    gridApi: any;
    gridColumnApi: any;
    retry_timer: any;
    constructor(props: gridProps) {
        super(props);

        this.state = {
            columnDefs: [
                checkboxColumn,
                deviceColumnDefs.name,
                deviceColumnDefs.uuids,
                deviceColumnDefs.status
            ],
            rowData: null,
            rowSelection: "multiple",
            autoGroupColumnDef: {
                headerName: "Checkbox",
                field: "checkbox",
                cellRenderer: "agGroupCellRenderer",
                cellRendererParams: {
                    checkbox: (params) => {
                        return params.node.group === false;
                    }
                }
            },
            softSelectedDevice: undefined,
            showNotification: false
        };
    }

    componentDidMount() {
        this.connectionStatusControl()
    }

    connectionStatusControl = () => {
      const updateConnectionSocket = new WebSocket(`wss://${this.props.mpsServer}/notifications/control.ashx`)
      updateConnectionSocket.onopen = () => {
            if (this.retry_timer != 0) {
                clearInterval(this.retry_timer);
                this.retry_timer = 0;
            }
        }

        updateConnectionSocket.onclose = () => {
            this.retry_timer = setInterval(() => {
             this.handleNotification()
                clearInterval(this.retry_timer);
            }, 5000);
        }

        updateConnectionSocket.onmessage = () => {
            setTimeout(() => {
                this.fetchDevices().then(response => this.setState({
                    rowData: response
                }))
            }, 200);
        }
    }

    fetchDevices = async () => await HttpClient.post(`https://${this.props.mpsServer}/admin`, JSON.stringify({
        "apikey": "xxxxx",
        "method": "AllDevices",
        "payload": {}
    }), this.context.data.mpsKey, true);

    filterDeviceList = devices => {
        return (this.props.filter === 'connected') ? devices.filter(device => device.conn === 1) : (this.props.filter === 'disconnected') ? devices.filter(device => device.conn === 0) : devices;
    }

    onGridReady = params => {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;

        this.fetchDevices().then(res => {
            const filteredDeviceList = this.filterDeviceList(res);
            if (filteredDeviceList.length === 0) {
                this.gridApi.showNoRowsOverlay()
            }
            this.setState({
                rowData: filteredDeviceList
            }, () => {
                if (this.props.selectedDevices && this.props.selectedDevices.length) {
                    this.props.selectedDevices.forEach(device => {
                        this.gridApi.forEachNode((node, index) => {
                            if (node.data.host === device.host) {
                                node.setSelected(node.data.host === device.host);
                            }
                        });
                    })
                }
            })
        })
            .catch(error => { this.gridApi.showNoRowsOverlay() })
    };

    onSelectionChanged = () => {
        if (isFunc(this.props.getSelectedDevices)) {
            this.props.getSelectedDevices(this.gridApi.getSelectedRows())
        }
    }

    getSoftSelectId = (id = {}) => id;

    handleNotification = () => {
        this.setState({
            showNotification: !this.state.showNotification
        }, () => {
            setTimeout(() => this.setState({ showNotification: !this.state.showNotification }), 5000)
        })
    }



    render() {
        const gridProps = {
            ...defaultDeviceGridProps,
            columnDefs: translateColumnDefs(this.state.columnDefs),
            rowData: this.state.rowData,
            onGridReady: this.onGridReady,
            rowSelection: this.state.rowSelection,
            groupSelectsChildren: true,
            suppressRowClickSelection: true,
            suppressAggFuncInHeader: true,
            autoGroupColumnDef: this.state.autoGroupColumnDef,
            rowMultiSelectWithClick: true,
            onSelectionChanged: this.onSelectionChanged,
            sizeColumnsToFit: true,
            getSoftSelectId: this.getSoftSelectId,
            softSelectId: (this.state.softSelectedDevice || {}).id,
            /* Grid Events */
            onRowClicked: ({ node }) => node.setSelected(!node.isSelected()),
            getRowClass: ({ data }) => !data.conn ? { opacity: 0.5 } : '',
            suppressNoRowsOverlay: false

        }
        return (
            <div>
                {this.state.showNotification && <SnackBar type="error" message="oops!!! something went wrong. please check server address" />}
                <PcsGrid key="device-grid-key" {...gridProps} />
            </div>
        )
    }
}

DeviceGrid.contextType = DomainContext;