/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2018 Florian Blume, Inc. and contributors
 * Copyright (c) 2020 Fernando Bevilacqua
 * Copyright (c) 2021 Ray Andrew
 * Copyright (c) 2021 Florian Blume
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import * as core from '@actions/core'
import * as exec from '@actions/exec'

async function run() {
  try {
    const cachedDir = core.getInput('dir')

    const requestedVersion = core.getInput('pybind11-version') || '2.8.0'
    const useMasterBranch =
      requestedVersion == 'master' ||
      requestedVersion == 'dev' ||
      requestedVersion == 'latest' ||
      requestedVersion == 'last'

    const cached = core.getInput('cached') == 'true'

    const version = useMasterBranch ? 'master' : requestedVersion

    const CMAKE_CXX_COMPILER = core.getInput('CMAKE_CXX_COMPILER')
    const CMAKE_INSTALL_PREFIX = core.getInput('CMAKE_INSTALL_PREFIX')

    if (cached) {
      core.startGroup('Install from cache')
      // Installation is fast and can be done from the cached built binaries
      await exec.exec(`sudo make -C ${cachedDir}/pybind11/build install`)
      core.endGroup()
    } else {
      core.startGroup('Download source code')

      await exec.exec(`mkdir -p ${cachedDir}`)

      await exec.exec(
        `git clone https://github.com/pybind/pybind11.git --branch v${version} --depth 1 ${cachedDir}/pybind11`
      )

      core.endGroup()

      /* eslint-disable prefer-template */
      const cmakeCmd =
        `cmake -S ${cachedDir}/pybind11 -B ${cachedDir}/pybind11/build ` +
        ' -D CMAKE_CXX_COMPILER=' +
        CMAKE_CXX_COMPILER +
        ' -D CMAKE_INSTALL_PREFIX=' +
        CMAKE_INSTALL_PREFIX
      /* eslint-enable prefer-template */

      /* eslint-disable no-console */
      console.log(`Compile cmd: ${cmakeCmd}`)
      /* eslint-enable no-console */

      core.startGroup('Compile and install')
      await exec.exec(cmakeCmd)
      await exec.exec(`make -j10 -C ${cachedDir}/pybind11/build`)
      await exec.exec(`sudo make -C ${cachedDir}/pybind11/build install`)
      core.endGroup()
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
