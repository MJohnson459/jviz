/**
 * This class describes a view of the immutable rosgraph.
 *
 * Most methods in this class will return a copy of itself to help with React
 */
class RosGraphView {
  constructor() {
    this.debugNames = [
        '/clock',
        '/cpu_monitor',
        '/diag_agg',
        '/hd_monitor',
        '/monitor',
        '/pr2_dashboard',
        '/rosapi',
        '/rosout_agg',
        '/rosout',
        '/rqt',
        '/runtime_logger',
        '/rviz',
        '/rxloggerlevel',
        '/statistics',
        '/record',
    ];

    this.active = null
    this.type = null
    this.toggled = []
    this.hidden = this.debugNames
    this.hideDebug = true
    this.relations = {
        in: [],
        out: [],
      }
  }

  toggleDebug() {
    this.hideDebug = !this.hideDebug
    if (this.hideDebug) {
      this.hidden = this.debugNames
    } else {
      // TODO: this won't work when filters are added
      this.hidden = []
    }

    return this
  }

  /**
   * @private
   */
  updateToggled(toggledList, id, toggled) {
    if (!toggledList) toggledList = []

    // Not in toggled list but meant to be
    if (toggled) {
      id.split("/").reduce((path, value) => {
        const subId = [path, value].join('/')
        const toggledIndex = toggledList.indexOf(subId)
        if (toggledIndex === -1) toggledList.push(subId)
        return subId
      })
    } else {
      // If we aren't meant to be toggled, remove element using splice
      // TODO: toggle all subtrees
      const toggledIndex = toggledList.indexOf(id)
      if (toggledIndex > -1) toggledList.splice(toggledIndex, 1)
    }

    return toggledList
  }

  setNodeActive(treeNode, toggled, rosGraph) {
    // set node active
    this.active = rosGraph.findNode(treeNode.id, treeNode.type) || treeNode
    this.type = treeNode.type
    this.relations = rosGraph.getRelations(treeNode.id, treeNode.type)

    // Toggled
    let newToggled = {}
    newToggled[treeNode.type] = this.updateToggled(this.toggled[treeNode.type], treeNode.id, toggled)
    newToggled[this.relations.type] = [...this.relations.in, ...this.relations.out].reduce((toggledList, relation) => this.updateToggled(toggledList, relation, true), [])

    this.toggled = newToggled

    return this
  }
}

export default RosGraphView;
