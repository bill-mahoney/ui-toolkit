/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import 'whatwg-fetch'

configure({ adapter: new Adapter() })

// configure({ adapter: new Adapter() });
