/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import * as React from 'react'
import ReactDom from 'react-dom'
import { NetworkEditor } from './NetworkEditor'
import { Provider } from '../shared/context/BasicContextProvider'

import i18n from '../../../../i18n'
// Get browser language
i18n.changeLanguage(navigator.language).catch(() => console.info('error occured'))

var url = new URL(window.location.href)
var params = new URLSearchParams(url.search)
const data = {
  rpsKey: process.env.API_KEY_RPS,
  mpsKey: process.env.API_KEY_MPS
}

ReactDom.render(<Provider data={data}><NetworkEditor rpsServer={params.get('rpsServer')}/></Provider>, document.getElementById('networkroot'))
