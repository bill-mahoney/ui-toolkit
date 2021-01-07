/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { HttpClient } from './HttpClient';


export const deleteCiraConfig = (rpsServer, ciraConfigName) => HttpClient.delete(`http://${rpsServer}/api/v1/admin/ciraconfigs/${ciraConfigName}`)
