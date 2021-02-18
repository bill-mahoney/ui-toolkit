/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import React from 'react'
import { PcsGrid } from '../shared/pcsGrid/PcsGrid'
import {
  defaultCiraGridProps,
  domainColumnDefs,
  checkboxColumn,
  domainDataModel
} from './DomainGridConfig'
import { translateColumnDefs } from '../shared/Methods'
import { isFunc, camelCaseReshape, isFalsy } from '../shared/Utilities'
import { HttpClient } from '../services/HttpClient'

export interface domainGridProps {
  rpsServer: string | null
  getSelectedDomain?: any
  updateDomainGrid?: boolean
  rpsKey: string
}

export interface domainGridState {
  columnDefs: any
  rowData: any
  rowSelection: any
  autoGroupColumnDef: any
  softSelectedDevice: any
}

export class DomainGrid extends React.Component<
domainGridProps,
domainGridState
> {
  gridApi: any
  gridColumnApi: any
  constructor (props: domainGridProps) {
    super(props)
    this.state = {
      columnDefs: [
        checkboxColumn,
        domainColumnDefs.Name,
        domainColumnDefs.DomainSuffix
      ],
      rowData: null,
      rowSelection: 'single',
      autoGroupColumnDef: {
        headerName: 'Checkbox',
        field: 'checkbox',
        cellRenderer: 'agGroupCellRenderer',
        cellRendererParams: {
          checkbox: (params) => {
            return params.node.group === false
          }
        }
      },
      softSelectedDevice: undefined
    }
  }

  // listen to parent components chages to re-render the profile grid
  componentDidUpdate (prevProps): void {
    if (this.props.updateDomainGrid !== prevProps.updateDomainGrid) {
      this.fetchDomains().then((data) => {
        const reshapedData = isFalsy(data) ? data.map(domain => camelCaseReshape(domain, domainDataModel)) : []
        this.setState({
          rowData: reshapedData
        })
      }).catch(() => console.info('error occured'))
    }
  }

  onSelectionChanged = (): void => {
    if (isFalsy(isFunc(this.props.getSelectedDomain))) {
      this.props.getSelectedDomain(this.gridApi.getSelectedRows())
    }
  }

  // Fetch the CIRA config scripts to be displayed on the grid
  fetchDomains = async (): Promise<any> => {
    const server: string = this.props.rpsServer != null ? this.props.rpsServer : ''
    return await HttpClient.get(`${server}/api/v1/admin/domains`, this.props.rpsKey)
      .then((data) => data)
      .catch(() => this.setState({ rowData: [] }))
  }

  /**
   * Grid ready event gets called on load of ag-grid
   */
  onGridReady = (params): any => {
    this.gridApi = params.api
    this.gridColumnApi = params.columnApi
    this.fetchDomains().then((data) => {
      const reshapedData = isFalsy(data) ? data.map(domain => camelCaseReshape(domain, domainDataModel)) : []
      this.setState({
        rowData: reshapedData
      })
    }).catch(() => console.info('error occured'))
  }

  getSoftSelectId = (id = {}): any => id
  render (): React.ReactNode {
    const gridProps = {
      ...defaultCiraGridProps,
      columnDefs: translateColumnDefs(this.state.columnDefs),
      rowData: this.state.rowData,
      onGridReady: this.onGridReady,
      rowSelection: this.state.rowSelection,
      groupSelectsChildren: true,
      suppressRowClickSelection: true,
      suppressAggFuncInHeader: true,
      autoGroupColumnDef: this.state.autoGroupColumnDef,
      rowMultiSelectWithClick: false,
      onSelectionChanged: this.onSelectionChanged,
      sizeColumnsToFit: true,
      getSoftSelectId: this.getSoftSelectId,
      softSelectId: (this.state.softSelectedDevice || {}).id,
      /* Grid Events */
      onRowClicked: ({ node }) => node.setSelected(!isFalsy(node.isSelected()))
    }
    return [<PcsGrid key="device-grid-key" {...gridProps} />]
  }
}
