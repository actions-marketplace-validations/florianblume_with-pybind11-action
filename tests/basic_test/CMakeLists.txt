cmake_minimum_required(VERSION 3.5)

project(pybind11-test-project LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_subdirectory(pybind11)
pybind11_add_module(pybind11-test-project main.cpp)

add_executable(pybind11-test-project main.cpp)
