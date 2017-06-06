#ifndef _H_TURTLESIM_
#define _H_TURTLESIM_

#include <ros/ros.h>
#include <geometry_msgs/Pose2D.h>
#include <geometry_msgs/Twist.h>

class TurtleSim {
private:
	static constexpr double SECS_PER_UPDATE = 0.1;
	// Data
	geometry_msgs::Pose2D m_pose;
	geometry_msgs::Twist m_twist;

	// Publisher/Subscriber
	ros::NodeHandle m_nodeHandle;
	ros::Publisher m_posePublisher;
	ros::Subscriber m_cmdVelSubscriber;

	// Callback for new speed
	void cmdVelCallback(const geometry_msgs::Twist& msg);

public:
	TurtleSim ();
	virtual ~TurtleSim () = default;

	// Update position
	void update();

	void publishPose();
};

#endif /* end of include guard: _H_TURTLESIM_ */
