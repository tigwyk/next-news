import React from 'react'
import Story from './story'
import { observe } from '../lib/get-item'

export default class extends React.Component {

  constructor (props) {
    super(props)
    this.state = props
  }

  componentDidMount () {
    // Start observing after 30 secs.
    // That's because we already have the latest data and no need to
    // start watching immediately.
    // With this we could reduce ~100 KB(firebase) initial data loading
    this.timeoutHandler = setTimeout(() => {
      this.unsubscribePromise = observe(
        this.props.id,
        (data) => this.setState(data)
      )
      this.timeoutHandler = null
    }, 1000 * 30)
  }

  componentWillUnmount () {
    // We haven't started watching yet.
    // So, clear the timeout and return
    if (this.timeoutHandler) {
      clearTimeout(this.timeoutHandler)
      return
    }

    this.unsubscribePromise
      .then(unsubscribe => unsubscribe())
  }

  render () {
    return <Story {...this.state} />
  }

}
