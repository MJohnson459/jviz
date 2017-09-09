
----------------------------------------------------------------------------------
      {
        nodes: [
          {
            name: "/node1",
            topics: {
              publishes: [
                {
                  name: "/generic_topic",
                  type: "std_msgs/String",
                }
              ],
              subscribes: [],
            },
            services: {
              clients: [],
              servers: [],
            }
          },
          {
            name: "/node2",
            topics: {
              publishes: [],
              subscribes: [
                {
                  name: "/generic_topic",
                  type: "std_msgs/String",
                }
              ],
            },
            services: {
              clients: [],
              servers: [],
            }
          },
        ],
      }

----------------------------------------------------------------------------------
      {
        nodes: [
          {name: "/node1"},
          {name: "/node2"},
        ]
        topics: [
          {
            name: "/generic_topic",
            type: "std_msgs/String",
            publishers: ["/node1"],
            subscribers: ["/node2"],
          }
        ],
        services: [
          {
            name: "/sum_numbers",
            messageType: "something/SumNumbers",
            server: "/node2",
          }
        ],
        actions: [
          {
            name: "/go_to_waypoint",
            server: "/node1",
            messageType: "nstd_msgs/GoToWaypoint",
            clients: [],
          }
        ]
      }
----------------------------------------------------------------------------------
      {
        nodes: [
          {
            name: "/node1",
            type: "node",
          },
          {
            name: "/node2",
            type: "node",
          },
          {
            name: "/generic_topic",
            type: "topic",
            messageType: "std_msgs/String",
          },
          {
            name: "/sum_numbers",
            type: "service"
            messageType: "something/SumNumbers",
          }
        ],
        edges: [
          {
            type: "topic_publisher",
            node: "/node1",
            topic: "/generic_topic"
          },
          {
            type: "topic_publisher",
            node: "/node2",
            topic: "/generic_topic",
          }

        ]
      }
----------------------------------------------------------------------------------

      [
        {
          name: "/node1",
          type: "node",
          out: [
            "/generic_topic",
          ]
        },
        {
          name: "/node2",
          type: "node",
          in: [
            "/generic_topic",
          ]
        },
        {
          name: "/generic_topic",
          type: "topic",
          messageType: "std_msgs/String",
          in: [
            "/node1",
          ],
          out: [
            "/node2",
          ]
        },
        {
          name: "/sum_numbers",
          type: "service"
          messageType: "something/SumNumbers",
        }
      ]

----------------------------------------------------------------------------------
