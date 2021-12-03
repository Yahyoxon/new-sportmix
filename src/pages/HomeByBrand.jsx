import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Navbar, Form } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { VscClose } from "react-icons/vsc";
import '../components/Product/product.scss'
import LazyLoad from 'react-lazyload';
import  '../components/Calculator/calculator.scss'
import axios from "axios";


const HomeByBrand = (props) => {
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
  const [IsShowMore, setIsShowMore] = useState(false);

  const { id } = useParams();
  useEffect(() => {
    window.scroll(0, 0)
  }, [id]);



  /// send telegram group

  const onSubmitModal = async(e) => {
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
    console.log(searchWord);
    const searchResult = props.product.filter((value) => {
      return value.name.toLowerCase().includes(searchWord.toLowerCase());
    });

    if (event === "") {
      setFilteredData([]);
    } else {
      setFilteredData(searchResult);
    }
    if (searchResult.length === 0) {
      setNotFound(<h5 style={{ textAlign: "center" }}>Ничего не найдено :(</h5>);
    }
  };

  useEffect(() => {
    setNotFound()
  }, [wordEntered])

  
  let categories = props.category.slice(0, 12);
  const showMoreCat = () => {
    setIsShowMore(!IsShowMore);
    window.scrollTo(0, 100);
  };

  return (
    <>
      <div className="headerContent">
        <Container>
          <Row style={{ alignItems: "center" }}>
            <Col>
              <Navbar expand="lg">
                <Navbar.Brand className="logoBox">
                  {props.brands.map((brand, i) => {
                    return id === brand.link && (
                      <div className="brandContent" key={i}>
                        <img
                          className="brandLogo"
                          key={i}
                          src={brand.image}
                          alt={brand.name}
                        />
                        <div className="brandName">{brand.name}</div>
                      </div>
                    );
                  })}
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
      <Container>
        <Row>
          <Col>
            <div className="kategoriy">Категории</div>
          </Col>
          <Col>
            <div className="show-more-button" onClick={showMoreCat}>
              {IsShowMore ? "Скрыть категории" : "Все категории"}
              <span>{" >>"}</span>
            </div>
          </Col>
        </Row>
        <Row>
          {IsShowMore? props.category.map((cat, i) => {
            return (
              <Col key={i} lg="2" md="3" sm="3" xs="3">
                  <div className="catBox">
                    <Link to={`/${id}/${cat.link}`}>
                      <div
                        className="imgBoxCat"
                      >
                        <div className="circle"></div>
                        <img src={cat.image} alt="" />
                      </div>
                    </Link>
                    <Link to={`/${id}/${cat.link}`}>
                      <div className="CatText">{cat.name}</div>
                    </Link>
                  </div>
              </Col>
            );
          }):
          (
            categories.map((cat, i) => {
              return (
                <Col key={i} lg="2" md="3" sm="3" xs="3">
                    <div className="catBox">
                      <Link to={`/${id}/${cat.link}`}>
                        <div
                          className="imgBoxCat"
                        >
                          <div className="circle"></div>
                          <img src={cat.image} alt="" />
                        </div>
                      </Link>
                      <Link to={`/${id}/${cat.link}`}>
                        <div className="CatText">{cat.name}</div>
                      </Link>
                    </div>
                </Col>
              );
            })
          )
          }
        </Row>
      </Container>
      <div className="productComponent">
        <Container>
          <Row>
            <Col>
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
              : (filteredData ? filteredData : props.product).map(
                (product, i) => {
                  return id === product.brand_name ?
                    <Col
                      lg="3"
                      md="4"
                      xs="6"
                      key={i}
                      onClick={() => setselectedProduct(product)}
                    >
                      <div className="procuctCard">
                        <div className="imgBox">
                          <LazyLoad height={300}>
                            <img
                              src={product.images[0]}
                              alt=""
                            />
                          </LazyLoad>
                          <div className="moreInfo">
                            <Link to={`/product/${product.id}`}>подробные</Link>
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
                    : ""
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
                    <Form.Control as="select" onChange={(e) => setRegion(e.target.value)} required >
                      <option selected value="Ташкент">Ташкент</option>
                      <option value="Ташкентская область">Ташкентская область	</option>
                      <option value="Андижанская область">Андижанская область</option>
                      <option value="Бухарская область">Бухарская область</option>
                      <option value="Джизакская область">Джизакская область</option>
                      <option value="Кашкадарьинская область">Кашкадарьинская область</option>
                      <option value="Навоийская область">Навоийская область</option>
                      <option value="Наманганская область">Наманганская область</option>
                      <option value="Самаркандская область">Самаркандская область</option>
                      <option value="Сурхандарьинская область">Сурхандарьинская область</option>
                      <option value="Сырдарьинская область">Сырдарьинская область</option>
                      <option value="Ферганская область">Ферганская область</option>
                      <option value="Хорезмская область">Хорезмская область	</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group className="w-100">
                    <Form.Label className="w-100">Количество</Form.Label>
                    <Form.Control as="select" onChange={(e) => setQuantity(e.target.value)} required >
                      <option selected value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </Form.Control>
                  </Form.Group>
                  <input
                    type="hidden"

                    placeholder="product"
                    value={order}
                  />
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
      </div>

      <div className="footerSection">
        <Container>
          <Row className="footer-row">
            <Col lg="4" md="4" sm="12">
              <div className="logoBoxFooter">
                {props.brands.map((brand, i) => {
                  return id === brand.link ? (
                    <div className="brandContent" key={i}>
                      <img
                        className="brandLogo"
                        key={i}
                        src={brand.image}
                        alt={brand.name}
                      />
                      <div className="brandName">{brand.name}</div>
                    </div>
                  ) : (
                    null
                  );
                })}
              </div>
            </Col>
            <Col lg="4" md="4" sm="12">
              <div className="bezperviynachalnovo-vzos">

              </div>
            </Col>
            <Col lg="4" md="4" sm="12">
              <div className="left-footer-box">
                <div className="footerCardImg">
                </div>
                <div className="footerCardImg2">
                </div>
                <div className="footerText">
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default HomeByBrand;
