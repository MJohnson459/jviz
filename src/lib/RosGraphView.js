// @flow
import * as RosGraph from './RosGraph'


/**
 * This class describes a view of the immutable rosgraph.
 *
 * Most methods in this class will return a copy of itself to help with React
 */

const DEBUG_NAMES = [
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

type SimpleNode = {
  name: string,
  path: string,
  type: RosGraph.PrimitiveType,
}


class RosGraphView {
  active: ?RosGraph.Primitive
  type: ?RosGraph.PrimitiveType
  toggled: Object
  hidden: Array<RosGraph.Id>
  hideDebug: boolean
  relations: ?RosGraph.Relations
  search: ?string
  filter: ?string

  constructor() {
    this.toggled = {}
    this.hidden = DEBUG_NAMES
    this.hideDebug = true
  }

  toggleDebug() {
    this.hideDebug = !this.hideDebug
    if (this.hideDebug) {
      this.hidden = DEBUG_NAMES
    } else {
      // TODO: this won't work when filters are added
      this.hidden = []
    }

    return this
  }

  hideItem = (path: string, type: string) => {
    this.hidden.push(path)
    return this
  }

  searchFor = (search: string) => {
    this.search = search
    return this
  }

  filterFor = (filter: string) => {
    this.filter = filter
    return this
  }

  /**
   * @private
   */
  updateToggled(toggledList: Array<RosGraph.Id> = [], path: string, toggled: boolean): Array<RosGraph.Id> {

    // Not in toggled list but meant to be
    if (toggled) {
      path.split("/").reduce((path, value) => {
        const subId = [path, value].join('/')
        const toggledIndex = toggledList.indexOf(subId)
        if (toggledIndex === -1) toggledList.push(subId)
        return subId
      })
    } else {
      // If we aren't meant to be toggled, remove element using splice
      // TODO: toggle all subtrees
      const toggledIndex = toggledList.indexOf(path)
      if (toggledIndex > -1) toggledList.splice(toggledIndex, 1)
    }

    return toggledList
  }

  setNodeActive(treeNode: SimpleNode, toggled: boolean, rosGraph: RosGraph.RosGraph) {
    // set node active
    this.active = rosGraph.findNode(treeNode.path, treeNode.type)
    this.type = treeNode.type
    const relations = rosGraph.getRelations(treeNode.path, treeNode.type)

    // Toggled
    let newToggled: Object = {}
    newToggled[treeNode.type] = this.updateToggled(this.toggled[treeNode.type], treeNode.path, toggled)
    if (relations) newToggled[relations.type] = [...relations.in, ...relations.out].reduce((toggledList, relation) => this.updateToggled(toggledList, relation, true), [])

    this.relations = relations
    this.toggled = newToggled

    return this
  }
}

export type {SimpleNode}
export default RosGraphView;
