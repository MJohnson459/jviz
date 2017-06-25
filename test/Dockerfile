FROM ros:kinetic-robot

RUN apt-get update && apt-get install -y \
	ros-kinetic-rosbridge-suite \
	ros-kinetic-ros-tutorials \
	ros-kinetic-py-trees-ros


COPY catkin_ws /catkin_ws

WORKDIR /catkin_ws

RUN bash -c "/ros_entrypoint.sh catkin_make -DCMAKE_INSTALL_PREFIX=/opt/ros/kinetic install"

COPY ros_entrypoint.sh /ros_entrypoint.sh
