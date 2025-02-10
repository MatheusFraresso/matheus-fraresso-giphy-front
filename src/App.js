import "./App.css"
import { useCallback, useEffect, useState } from "react"
import axios from "axios"
import "bootstrap/dist/css/bootstrap.min.css"

import {
  Button,
  Col,
  Container,
  ListGroup,
  Row,
  Spinner,
} from "react-bootstrap"

function App() {
  const [giphs, setGiphs] = useState([])
  const [pagination, setPagination] = useState({})
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [searchOffset, setSearchOffset] = useState(0)

  function changeOffset(event) {
    let offset = event.target.value
    if (offset < 1 || offset > pagination.total_count) {
      alert("Offset number is invalid")
      setSearchOffset(searchOffset)
    } else {
      setSearchOffset(offset)
    }
  }

  const fetchGiphs = useCallback(async () => {
    setLoading(true)
    let giphs = null

    let endpoint = "https://api.giphy.com/v1/gifs/"
    if (search) {
      endpoint += `search?q=${search}`
    } else {
      endpoint += "trending?"
    }
    endpoint += `&offset=${searchOffset}`
    endpoint += "&api_key=pLURtkhVrUXr3KG25Gy5IvzziV5OrZGa"

    try {
      giphs = await axios.get(endpoint)

      setPagination(giphs.data.pagination)
      setGiphs(giphs.data.data)
    } catch (error) {
      console.error(error.message)
      setGiphs([])
    } finally {
      setLoading(false)
    }
  }, [search, searchOffset])

  useEffect(() => {
    fetchGiphs()
  }, [fetchGiphs])

  return (
    <div className="App">
      <header className="App-header">Matheus Giphy API front</header>
      <section className="App-search-section">
        <input
          type="text"
          placeholder="Search Giphs"
          onChange={(e) => setSearch(e.target.value)}
        ></input>
      </section>
      <section>
        {loading ? (
          <Spinner animation="border"></Spinner>
        ) : (
          <ListGroup>
            {giphs.map((giph) => (
              <Container>
                <Row className="giph-row">
                  <Col xs={12} className="title">
                    {giph.title}
                  </Col>
                  <Col xs={12}>
                    <img src={giph.images.original.url} alt={giph.title}></img>
                  </Col>
                </Row>
              </Container>
            ))}
          </ListGroup>
        )}
      </section>
      <section className="pagination">
        <Container>
          <Row>
            <Col>
              <Button
                disabled={pagination.offset === 0}
                onClick={() => setSearchOffset(searchOffset - pagination.count)}
              >
                Prev
              </Button>
            </Col>
            <Col>
              <Row>
                <Col>
                  {" "}
                  {pagination?.offset} to{" "}
                  {pagination?.offset + pagination.count} {""}
                  of {pagination?.total_count}
                </Col>
              </Row>
              <Row className="mt-4">
                <Col>
                  Or Go To{" "}
                  <input
                    type="number"
                    placeholder="Add offset"
                    onChange={(e) => changeOffset(e)}
                  ></input>
                </Col>
              </Row>
            </Col>
            <Col>
              <Button
                disabled={pagination.offset === pagination.total_count}
                onClick={() => setSearchOffset(searchOffset + pagination.count)}
              >
                Next
              </Button>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  )
}

export default App
