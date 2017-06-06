#!/bin/bash
set -e

export ROS_MASTER_URI="http://master:11311"
export ROS_HOSTNAME="$(hostname)"

# setup ros environment
source "/opt/ros/$ROS_DISTRO/setup.bash"
exec "$@"
