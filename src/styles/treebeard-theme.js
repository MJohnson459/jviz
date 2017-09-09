export default {
  tree: {
    base: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      fontSize: '16px',
      overflowY: 'auto',
    },
    node: {
      base: {
        position: 'relative',
        paddingLeft: 15,
      },
      link: {
        cursor: 'pointer',
        position: 'relative',
        padding: '0px 5px',
        display: 'block'
      },
      activeLink: {
        background: '#31363F',
        color: 'rgba(122, 192, 210, 0.86)'
      },
      toggle: {
        base: {
          position: 'relative',
          display: 'inline-block',
          verticalAlign: 'top',
          marginLeft: '-15px',
          height: '20px',
          width: '15px'
        },
        wrapper: {
          position: 'absolute',
          top: '50%',
          left: '50%',
          margin: '-7px 0 0 -7px',
          height: '10px'
        },
        height: 10,
        width: 10,
        arrow: {
          fill: '#9DA5AB',
          strokeWidth: 0
        }
      },
      header: {
        base: {
          display: 'inline-block',
          verticalAlign: 'top',
          // color: '#9DA5AB'
        },
        connector: {
          width: '2px',
          height: '14px',
          borderLeft: 'solid 2px black',
          borderBottom: 'solid 2px black',
          position: 'absolute',
          top: '0px',
          left: '-21px'
        },
        title: {
          lineHeight: '22px',
          verticalAlign: 'middle'
        }
      },
      subtree: {
        listStyle: 'none',
        paddingLeft: '0px'
      },
      loading: {
        color: '#E2C089'
      }
    }
  }
};
