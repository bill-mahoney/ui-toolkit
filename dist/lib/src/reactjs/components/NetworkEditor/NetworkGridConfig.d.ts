/*********************************************************************
 * Copyright (c) Intel Corporation 2020
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/
export declare const FIRST_COLUMN_CLASS = "first-child-column";
export declare const CHECKBOX_COLUMN_CLASS = "checkbox-column";
/**
 * Column definitions for Network config settings
 */
export declare const networkColumnDefs: {
    Name: {
        headerName: string;
        field: string;
        sort: string;
        filter: string;
        filterParams: {
            applyButton: boolean;
            clearButton: boolean;
        };
        sortable: boolean;
    };
    DHCPEnabled: {
        headerName: string;
        field: string;
        filter: string;
        filterParams: {
            applyButton: boolean;
            clearButton: boolean;
        };
        sortable: boolean;
    };
};
export declare const checkboxColumn: {
    lockPosition: boolean;
    cellClass: string;
    resizable: boolean;
    suppressMenu: boolean;
    checkboxSelection: boolean;
    suppressMovable: boolean;
    width: number;
};
export declare const defaultNetworkGridProps: {
    pagination: boolean;
    paginationPageSize: number;
    rowSelection: string;
    resizable: boolean;
};
export declare const networkDataModal: {
    profileName: string;
    dhcpEnabled: string;
    ipSyncEnabled: string;
    staticIpShared: string;
};