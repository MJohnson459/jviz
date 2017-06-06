#include <turtlesim/turtlesim.hpp>

int main(int argc, char *argv[]) {
	ros::init(argc, argv, "turtle_sim");
	TurtleSim turtle;

	ros::Rate spinRate(10); // Hz

	while (ros::ok()) {
		turtle.update();
		ros::spinOnce();
		spinRate.sleep();
	}

	return 0;
}
