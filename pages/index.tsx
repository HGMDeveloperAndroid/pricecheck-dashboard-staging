import React, { Component } from 'react'
import Router from 'next/router'
import { validateSession } from '../utils/session-management'

class Home extends Component {

  componentDidMount() {
    validateSession('/home')
  }

  render() {
    return (
      <div></div>
    )
  }
}

export default Home