import React, { useState, useEffect } from "react";
import { Button, Col, Container, Row, Navbar, Form } from "react-bootstrap";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { VscClose } from "react-icons/vsc";
import logo from "../../logo.svg";
import LazyLoad from "react-lazyload";
import "../Calculator/calculator.scss";
import axios from "axios";

const ProductsByCat = (props) => {
  const { link } = useParams();
  const [selectedProduct, setselectedProduct] = useState([]);
  const [order, setOrder] = useState([]);
  const [prodOrder, setProdOrder] = useState([]);
  const [prodOrderPrice, setProdOrderPrice] = useState([]);
  const [clientName, setName] = useState("");
  const [region, setRegion] = useState("Ташкент");
  const [quantity, setQuantity] = useState("1");
  const [clientphoneNumber, setPhoneNumber] = useState("");
  const [openModalClass, setOpenModalClass] = useState("modalSectionHidden");
  const [successModal, setSuccessModal] = useState("forHidden");
  const [filteredData, setFilteredData] = useState();
  const [wordEntered, setWordEntered] = useState("");
  const [notFound, setNotFound] = useState();

  /// send telegram group

  const onSubmitModal = async (e) => {
    e.preventDefault();
    const response = await axios.post(
      "https://api.sport-mix.uz/api/order/create",
      {
        product: order,
        username: clientName,
        phone: clientphoneNumber,
        region: region,
        quantity: quantity,
        cashback: 0,
        total_price: prodOrderPrice,
        brand_name: prodOrder,
        image: selectedProduct.images[0],
        oqim: null,
      }
    );
    if ((response.data = "true")) {
      setName("");
      setPhoneNumber("");
      setRegion("");
      setQuantity("");
      setSuccessModal("modalSuccessSubmit");
      setOpenModalClass("forHidden");
    }
  };
  //search
  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    const searchResult = props.selectedProductProps.filter((value) => {
      return value.name.toLowerCase().includes(searchWord.toLowerCase());
    });

    if (event === "") {
      setFilteredData([]);
    } else {
      setFilteredData(searchResult);
    }
    if (searchResult.length === 0) {
      setNotFound("Ничего не найдено :(");
    }
  };
  useEffect(() => {
    setNotFound();
  }, [wordEntered]);


  return (
    <>
      <div className="headerContent">
        <Container>
          <Row style={{ alignItems: "center" }}>
            <Col>
              <Navbar expand="lg">
                <Navbar.Brand className="logoBox">
                    <Link to="/">
                      <div className="logoBox">
                        <img src={logo} alt="logo" />
                      </div>
                    </Link>
                </Navbar.Brand>
              </Navbar>
            </Col>
            <Col>
              <div className="callButton">
                <a href="tel:+998712000277">
                  <Button variant="outline-dark">+998 71 200-02-77</Button>
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <br/>
      <Container style={{minHeight:'80vh'}}>
        <Row>
          {props.categoriesProps.map((cat, k) => {
            return link === cat.link ? (
              <Col lg="6" md="6" xs="12" key={k}>
                <h2>{cat.name}</h2>
              </Col>
            ) : (
              ""
            );
          })}
          <Col lg="6" md="6" xs="12">
            <div className="searchContainer">
              <input
                className="form-control searchInput"
                type="text"
                placeholder="Поиск товаров..."
                value={wordEntered}
                onChange={handleFilter}
              />
            </div>
            <br />
          </Col>
        </Row>
        <Row>
          {notFound
            ? notFound
            : (filteredData ? filteredData : props.selectedProductProps).map(
                (product, i) => {
                  return (
                    link === product.category_name &&
                    (product.installment === "order" ||
                      product.installment === "all") && (
                      <Col
                        lg="5x5"
                        md="4"
                        xs="6"
                        key={i}
                        onClick={() => setselectedProduct(product)}
                      >
                        <div className="procuctCard">
                          <div className="imgBox">
                            <LazyLoad height={300}>
                              <img src={product.images[0]} alt="" />
                            </LazyLoad>
                            <div className="moreInfo">
                              <Link to={`/product/${product.id}`}>
                                подробные
                              </Link>
                            </div>
                          </div>
                          <div className="productTexts">
                            <h2 className="productName">{product.name}</h2>
                            <div className="priceAndbutton">
                              <p className="productPrice">
                                {Number(product.price).toLocaleString()} сум
                              </p>
                              <div className="bottomButtons">
                                <div
                                  className="orderr"
                                  onClick={() => {
                                    setOpenModalClass("modalSection");
                                  }}
                                >
                                  <Button
                                    variant="outline-dark"
                                    className="buttonkupitVrasrochka"
                                    onClick={() => {
                                      setOrder(product.name);
                                      setProdOrder(product.brand_name);
                                      setProdOrderPrice(product.price);
                                    }}
                                  >
                                    Заказать
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Col>
                    )
                  );
                }
              )}
          <div className={openModalClass}>
            <form className="mainModalContainer" onSubmit={onSubmitModal}>
              <div
                className="closeBtn"
                onClick={() => setOpenModalClass("forHidden")}
              >
                <VscClose />
              </div>
              <div className="inputFormBox">
                <label htmlFor="">
                  <b>Товар:</b> {order}
                </label>
                <Form.Group className="w-100">
                  <Form.Label className="w-100 mt-4">Имя</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    required
                    value={clientName}
                  />
                </Form.Group>
                <Form.Group className="w-100">
                  <Form.Label className="w-100">Номер телефона</Form.Label>
                  <Form.Control
                    type="tel"
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+998901234567"
                    required
                    value={clientphoneNumber}
                  />
                </Form.Group>
                <Form.Group className="w-100">
                  <Form.Label className="w-100">Выберите регион</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={(e) => setRegion(e.target.value)}
                    required
                  >
                    <option selected value="Ташкент">
                      Ташкент
                    </option>
                    <option value="Ташкентская область">
                      Ташкентская область
                    </option>
                    <option value="Андижанская область">
                      Андижанская область
                    </option>
                    <option value="Бухарская область">Бухарская область</option>
                    <option value="Джизакская область">
                      Джизакская область
                    </option>
                    <option value="Кашкадарьинская область">
                      Кашкадарьинская область
                    </option>
                    <option value="Навоийская область">
                      Навоийская область
                    </option>
                    <option value="Наманганская область">
                      Наманганская область
                    </option>
                    <option value="Самаркандская область">
                      Самаркандская область
                    </option>
                    <option value="Сурхандарьинская область">
                      Сурхандарьинская область
                    </option>
                    <option value="Сырдарьинская область">
                      Сырдарьинская область
                    </option>
                    <option value="Ферганская область">
                      Ферганская область
                    </option>
                    <option value="Хорезмская область">
                      Хорезмская область
                    </option>
                  </Form.Control>
                </Form.Group>
                <Form.Group className="w-100">
                  <Form.Label className="w-100">Количество</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  >
                    <option selected value="1">
                      1
                    </option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </Form.Control>
                </Form.Group>
                <input type="hidden" placeholder="product" value={order} />
                <button type="submit" className="buttonModal">
                  Отправить
                </button>
              </div>
            </form>
          </div>
          <div className={successModal}>
            <div id="success-icon">
              <div></div>
            </div>
            <svg
              id="close-modal"
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              viewBox="0 0 10 10"
              onClick={() => setSuccessModal("forHidden")}
            >
              <line x1="1" y1="-1" x2="9" y2="11" strokeWidth="2.5" />
              <line x1="9" y1="-1" x2="1" y2="11" strokeWidth="2.5" />
            </svg>
            <h3>
              <strong>Ваша заявка успешно отправлена</strong>
            </h3>
          </div>
        </Row>
      </Container>
      <div className="footerSection">
        <Container>
          <Row className="footer-row">
            <Col lg="4" md="4" sm="12">
            <Navbar expand="lg">
                <Navbar.Brand className="logoBox">
                    <Link to="/">
                      <div className="logoBox">
                        <img src={logo} alt="logo" />
                      </div>
                    </Link>
                </Navbar.Brand>
              </Navbar>
            </Col>
            <Col lg="4" md="4" sm="12">
              <div className="bezperviynachalnovo-vzos"></div>
            </Col>
            <Col lg="4" md="4" sm="12">
              <div className="left-footer-box">
                <div className="footerCardImg">
                  {/* <img src={cardImage} alt="" /> */}
                </div>
                <div className="footerCardImg2">
                  {/* <img src={cartPasport} alt="" /> */}
                </div>
                <div className="footerText"></div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default ProductsByCat;
