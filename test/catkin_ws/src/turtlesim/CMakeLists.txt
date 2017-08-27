cmake_minimum_required(VERSION 2.8.3)
set (CMAKE_CXX_STANDARD 11)
project(turtlesim)

find_package(catkin REQUIRED COMPONENTS
  geometry_msgs
  roscpp
)

catkin_package()

## Build ##
include_directories(
  include
  ${catkin_INCLUDE_DIRS}
)

add_executable(turtlesim_node src/turtlesim_node.cpp src/turtlesim.cpp)
add_dependencies(turtlesim_node ${${PROJECT_NAME}_EXPORTED_TARGETS} ${catkin_EXPORTED_TARGETS})

target_link_libraries(turtlesim_node
  ${catkin_LIBRARIES}
)

## Install ##
install(TARGETS turtlesim_node
  ARCHIVE DESTINATION ${CATKIN_PACKAGE_LIB_DESTINATION}
  LIBRARY DESTINATION ${CATKIN_PACKAGE_LIB_DESTINATION}
  RUNTIME DESTINATION ${CATKIN_PACKAGE_BIN_DESTINATION}
)
