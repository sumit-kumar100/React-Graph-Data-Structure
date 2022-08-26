import React, { useState, useEffect } from 'react';
import { paths } from './utils';
import { Container, Accordion, Navbar, Row, Col, Form, Button, Table } from 'react-bootstrap';
import { Canvas } from 'reaflow';

const Home = () => {

  const [user, setUser] = useState("")

  const [relay, setRelay] = useState({ from: "FROM", to: "TO" })

  const [nodes, setNodes] = useState([])

  const [edges, setEdges] = useState([])

  const [query, setQuery] = useState({ from: "", to: "" })

  const [solution, setSolution] = useState([])

  const addNode = () => {
    localStorage.setItem(
      'nodes',
      JSON.stringify([
        ...nodes,
        {
          id: '_' + Math.random().toString(36).substr(2, 9),
          text: user
        }
      ])
    )
    setNodes(JSON.parse(localStorage.getItem('nodes')) || [])
    setUser("")
  }

  const deleteNode = ID => {
    localStorage.setItem(
      'nodes',
      JSON.stringify(nodes.filter(node => node.id !== ID))
    )
    localStorage.setItem(
      'edges',
      JSON.stringify(edges.filter(edge => !edge.id.includes(ID)))
    )
    setNodes(JSON.parse(localStorage.getItem('nodes')) || [])
    setEdges(JSON.parse(localStorage.getItem('edges')) || [])
    setSolution([])
  }

  const addEdge = () => {
    localStorage.setItem(
      'edges',
      JSON.stringify([
        ...edges,
        {
          id: `${relay.from}-${relay.to}`,
          from: relay.from,
          to: relay.to
        }
      ])
    )
    setEdges(JSON.parse(localStorage.getItem('edges')) || [])
  }

  const deleteEdge = ID => {
    localStorage.setItem(
      'edges',
      JSON.stringify(edges.filter(edge => edge.id !== ID))
    )
    setEdges(JSON.parse(localStorage.getItem('edges')) || [])
    setSolution([])
  }

  const handleQuery = () => {
    const { from, to } = query
    const data = paths({
      graph: edges.map(edge => [edge.from, edge.to]),
      from,
      to
    })
    const result = []
    data.forEach(row => {
      let new_node = []
      let new_edge = []
      for (let i = 0; i < row.length; i++) {
        if (i === (row.length - 1)) {
          new_node.push(nodes?.find(child => child.id === row[i]))
        }
        else {
          new_node.push(nodes?.find(child => child.id === row[i]))
          new_edge.push({
            id: `${row[i]}-${row[i + 1]}`,
            from: row[i],
            to: row[i + 1]
          })
        }
      }
      result.push({
        nodes: new_node,
        edges: new_edge
      })
    })
    setSolution(result)
  }

  useEffect(() => {
    setNodes(JSON.parse(localStorage.getItem('nodes')) || [
      { id: '_t666cw9y1', text: 'Sameer' },
      { id: '_8pz2ednhj', text: 'Aayushi' },
      { id: '_3afgrgj20', text: 'Bhaskar' },
      { id: '_ocjtk3cy9', text: 'Kamalnath Sharma' },
      { id: '_q697blh50', text: 'Shanti Kumar Saha' }
    ])
    setEdges(JSON.parse(localStorage.getItem('edges')) || [
      { id: '_t666cw9y1-_8pz2ednhj', from: '_t666cw9y1', to: '_8pz2ednhj' },
      { id: '_8pz2ednhj-_3afgrgj20', from: '_8pz2ednhj', to: '_3afgrgj20' },
      { id: '_t666cw9y1-_ocjtk3cy9', from: '_t666cw9y1', to: '_ocjtk3cy9' },
      { id: '_ocjtk3cy9-_q697blh50', from: '_ocjtk3cy9', to: '_q697blh50' },
      { id: '_q697blh50-_3afgrgj20', from: '_q697blh50', to: '_3afgrgj20' }
    ])
  }, [])

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="/" className='ms-4'>Facebook</Navbar.Brand>
      </Navbar>
      <Container fluid={true}>
        <Row>
          <Col lg={4}>
            <Accordion>
              <Accordion.Item eventKey="0" className='my-4'>
                <Accordion.Header>MANAGE - USERS</Accordion.Header>
                <Accordion.Body>
                  <div className='d-flex gap-4'>
                    <Form.Group className="w-75">
                      <Form.Control
                        type="email"
                        placeholder="Enter Name"
                        value={user}
                        onChange={e => setUser(e.target.value)}
                      />
                    </Form.Group>
                    <Button
                      variant="dark"
                      className="w-25"
                      onClick={addNode}
                      disabled={user === ""}
                    >
                      ADD
                    </Button>
                  </div>
                  <div className='mt-3'>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>S.no</th>
                          <th>Name</th>
                          <th className='text-center'>Remove</th>
                        </tr>
                      </thead>
                      <tbody>
                        {nodes?.map((user, i) => (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{user.text}</td>
                            <td className='text-center fw-bold text-danger' style={{ cursor: 'pointer' }} onClick={() => deleteNode(user.id)}>X</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>MANAGE - RELATIONS</Accordion.Header>
                <Accordion.Body>
                  <div className='d-flex gap-1'>
                    <Form.Select onChange={e => setRelay({ ...relay, from: e.target.value })}>
                      <option>FROM</option>
                      {nodes?.map(user => (
                        <option key={user.id} value={user.id}>{user.text}</option>
                      ))}
                    </Form.Select>
                    <Form.Select onChange={e => setRelay({ ...relay, to: e.target.value })}>
                      <option>TO</option>
                      {nodes?.map(user => (
                        <option key={user.id} value={user.id}>{user.text}</option>
                      ))}
                    </Form.Select>
                    <Button
                      variant="dark"
                      className="w-25"
                      onClick={addEdge}
                      disabled={relay.from === 'FROM' || relay.to === 'TO'}
                    >
                      ADD
                    </Button>
                  </div>
                  <div className='mt-3'>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>S.no</th>
                          <th>Relation (Friends)</th>
                          <th className='text-center'>Remove</th>
                        </tr>
                      </thead>
                      <tbody>
                        {edges?.map((edge, i) => {
                          const from = nodes.find(node => node.id === edge.from)
                          const to = nodes.find(node => node.id === edge.to)
                          return (
                            <tr key={i}>
                              <td>{i + 1}</td>
                              <td>
                                {from.text}
                                <span className='fw-bold fs-5 mx-3'>
                                  →
                                </span>
                                {to.text}
                              </td>
                              <td className='text-center fw-bold text-danger' style={{ cursor: 'pointer' }} onClick={() => deleteEdge(edge.id)}>X</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </Table>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            <div>
              <h5 className='text-center mt-5'>Select Users</h5>
              <Form.Select className='my-4' onChange={e => setQuery({ ...query, from: e.target.value })}>
                <option>First Person</option>
                {nodes?.map(user => (
                  <option key={user.id} value={user.id}>{user.text}</option>
                ))}
              </Form.Select>
              <Form.Select className='my-4' onChange={e => setQuery({ ...query, to: e.target.value })}>
                <option>Second Person</option>
                {nodes?.map(user => (
                  <option key={user.id} value={user.id}>{user.text}</option>
                ))}
              </Form.Select>
              <Button
                variant="dark"
                className="w-100"
                disabled={query.from === '' || query.to === ''}
                onClick={handleQuery}
              >
                Calculate Degree of Seperation
              </Button>
            </div>
          </Col>
          <Col lg={4}>
            <div>
              <h5 className='text-center mt-3'>Basic Structure</h5>
              <Canvas
                maxWidth={800}
                maxHeight={600}
                disabled
                nodes={nodes}
                edges={edges}
              />
            </div>
          </Col>
          <Col lg={4}>
            <div>
              <h5 className='text-center mt-3'>Output ( Degree of Seperation )</h5>
              <div className='d-flex gap-2'>
                {solution?.length > 0 ? (
                  solution.map(({ nodes, edges }, i) => {
                    return (
                      <div key={i}>
                        <div className='text-center'>
                          {nodes.map((node, i) => (nodes.length - 1) === i ? `${node.text}` : `${node.text} → `)}
                        </div>
                        <Canvas
                          maxWidth={200}
                          maxHeight={500}
                          disabled
                          nodes={nodes}
                          edges={edges}
                        />
                      </div>
                    )
                  })
                ) : null}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  )
};

export default Home;