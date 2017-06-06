#include <turtlesim/turtlesim.hpp>
#include <cmath>

TurtleSim::TurtleSim() {

	m_posePublisher = m_nodeHandle.advertise<geometry_msgs::Pose2D>("pose_2d", 10, true);
	m_cmdVelSubscriber = m_nodeHandle.subscribe("cmd_vel", 10, &TurtleSim::cmdVelCallback, this);

}

void TurtleSim::cmdVelCallback(const geometry_msgs::Twist& msg) {
	m_twist = msg;
}

void TurtleSim::update() {
	// Add twist*constant to position
	// Assume instantatious reaction to speed changes so just add twist*update to pose
	// Ignoring y velocity

	m_pose.x += SECS_PER_UPDATE*m_twist.linear.x*std::cos(m_pose.theta);
	m_pose.y += SECS_PER_UPDATE*m_twist.linear.x*std::sin(m_pose.theta);
	m_pose.theta += SECS_PER_UPDATE*m_twist.angular.z;
	publishPose();
}

void TurtleSim::publishPose() {
	m_posePublisher.publish(m_pose);
}
