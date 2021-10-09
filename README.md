# with-pybind11-action

Cacheable Pybind11 installation from source for your Github Actions.
The reason for this action is that on e.g. Ubuntu 18.04 an older version of Pybind11 gets installed which misses `embed.h` for example. This action allows to build the latest Pybind11 version from their GitHub repository.

---

This repo is based on:
- [With OpenCV Action](https://github.com/rayandrews/with-opencv-action)

Credits to @rayandrews (who apparently took inspiration in my install OpenCV approach
so I guess we've come full circle ;))

## Options

See `action.yml`

## Example

~~~~
- name: Cache Pybind11
  id: pybind11-cache
  uses: actions/cache@v2
  with:
    path: ./pybind11-install
    key: ${{ runner.os }}-pybind11-cache

- name: Install OpenCV
  uses: rayandrews/with-pybind11-action@v1
  with:  
    dir: ./pybind11-install
    cached: ${{ steps.pybind11-cache.outputs.cache-hit }}
    pybind11-version: '4.0.0'
~~~~
