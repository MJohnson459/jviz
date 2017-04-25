FROM ros:kinetic-robot

RUN apt-get update && apt-get install -y \
  ros-kinetic-rosbridge-suite \
  ros-kinetic-ros-tutorials \
  ros-kinetic-cv-bridge \
  ros-kinetic-image-transport

COPY /catkin_ws /catkin_ws

WORKDIR /catkin_ws
RUN bash -c "source /ros_entrypoint.sh && catkin_make install && cp -r install/* /opt/ros/kinetic/"
