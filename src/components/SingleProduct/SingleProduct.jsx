import React, { useEffect, useState } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import "./singleproduct.scss";
import Footer from "../Footer/Footer";
import "../../components/Product/product.scss";

const SingleProduct = ({ product, brands }) => {
  const apiUrl = "https://admin.sport-mix.uz/"
  const history = useHistory();
  const { id } = useParams();
  const [order, setOrder] = useState([]);
  const [singleProductBrand, setSingleProductBrand] = useState({});
  const [prodOrder, setProdOrder] = useState([]);
  const [prodOrderPrice, setProdOrderPrice] = useState([]);
  const [clientName, setName] = useState("");
  const [region, setRegion] = useState("Ташкент");
  const [quantity, setQuantity] = useState("1");
  const [productImage, setProductImage] = useState("");
  const [clientphoneNumber, setPhoneNumber] = useState("");
  // const [openModalClass, setOpenModalClass] = useState("modalSectionHidden");
  const [successModal, setSuccessModal] = useState("forHidden");
  const orderPriceSplite = Number(prodOrderPrice).toLocaleString();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  let singleProduct = [];
  for (let index = 0; index < product.length; index++) {
    if (product[index].id === id) {
      singleProduct = product[index];
    }
  }
  useEffect(() => {
    const brandFinder = (brand) => {
      for (let i = 0; i < brand.length; i++) {
        if (brand[i].link === singleProduct.brand_name) {
          setSingleProductBrand(brand[i]);
        }
      }
    };
    brandFinder(brands);
  }, [brands, singleProduct.brand_name]);

  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    setMainImage(singleProduct.image);
  }, [product, singleProduct.image]);

  const clickBtn = () => {
    localStorage.setItem("singleProductValue", JSON.stringify(singleProduct));
    history.push("/");
  };
  const chat_ID = singleProductBrand.telegram_chat_id;
  //send telegram

  useEffect(() => {
    setOrder(singleProduct.name);
  }, [singleProduct.name])

  useEffect(() => {
    setProdOrder(singleProduct.brand_name);
  }, [singleProduct.brand_name])

  useEffect(() => {
    setProdOrderPrice(singleProduct.price);
  }, [singleProduct.price])

  useEffect(() => {
    setProductImage(singleProduct.image);
  }, [singleProduct.image])

  const onSubmitModal = (e) => {
    e.preventDefault();
    let api = new XMLHttpRequest();
    var forSend = `🏪 Магазин: ${prodOrder}%0A💵 Наличными%0A%0A👥Имя: ${clientName}%0A📞Тел: ${clientphoneNumber}%0A📦Товар: ${order}%0A💵Итого: ${orderPriceSplite} сум%0A📍 Регион: ${region}%0A🖇 Количество: ${quantity}%0A%0A ${apiUrl + "uploads/" + productImage}`;
    var token = "1745885286:AAGnCac1rJJnQI2XIAUW8LL2_RN2MHN-SVE";
    var url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat_ID}&text=${forSend}`;
    api.open("GET", url, true);
    api.send();
    setName("");
    setRegion("");
    setQuantity("");
    setProductImage("");
    setPhoneNumber("");
    setSuccessModal("modalSuccessSubmit");
    // setOpenModalClass("forHidden");
  };

  return (
    <>
      <div className="viewComponent">
        <Container>
          <Row>
            <Col className="centeredCol" lg="6" md="6" sm="12">
              <div className="main-image">
                <img
                  className="oneImage"
                  src={apiUrl + "/uploads/" + mainImage}
                  alt={singleProduct.image}
                />
              </div>
              <div className="images-gallery">
                {singleProduct.gallery_1 ? (
                  <img
                    src={
                      apiUrl + "/uploads/" +
                      singleProduct.gallery_1
                    }
                    alt=""
                    onClick={() => setMainImage(singleProduct.gallery_1)}
                  />
                ) : (
                  ""
                )}
                {singleProduct.gallery_2 ? (
                  <img
                    src={
                      apiUrl + "/uploads/" +
                      singleProduct.gallery_2
                    }
                    alt=""
                    onClick={() => setMainImage(singleProduct.gallery_2)}
                  />
                ) : (
                  ""
                )}
                {singleProduct.gallery_3 ? (
                  <img
                    src={
                      apiUrl + "/uploads/" +
                      singleProduct.gallery_3
                    }
                    alt=""
                    onClick={() => setMainImage(singleProduct.gallery_3)}
                  />
                ) : (
                  ""
                )}
              </div>
            </Col>

            <Col lg="6" md="6" sm="12" className="centeredCol">
              <h3 className="title">{singleProduct.name}</h3>
              <div className="brandsBox">
                <div className="imageBoxSingle">
                  <Link to={`/${singleProductBrand.link}`}>
                    <img
                      src={
                        apiUrl + "/uploads/" +
                        singleProductBrand.image
                      }
                      alt={singleProductBrand.name}
                    />
                  </Link>
                </div>
                <Link to={`/${singleProductBrand.link}`}>
                  <p className="brand">{singleProductBrand.name}</p>
                </Link>
              </div>
              <Row className=" mb-3">

                <Col lg="6">
                  <p className="price">{Number(singleProduct.price).toLocaleString()}сум </p>
                </Col>
                <Col lg="6">
                  {singleProduct.order_type === "all" || singleProduct.order_type === "" || singleProduct.order_type === "installment" ? (
                    <Button className="orderButton" onClick={() => { clickBtn(); }} > Рассрочку </Button>) : ("")}
                </Col>

              </Row>
              <p className="desc"><span>Описание<br /></span><br />{singleProduct.description}</p>

              <form onSubmit={onSubmitModal}>
                <br />
                <div>
                  <label className="mb-1" htmlFor="">
                    <h4><strong>Закажите прямо сейчас</strong></h4>
                  </label>

                  <Row>
                    <Col lg="6">
                      <Row>
                        <Col lg="12" md="12">
                          <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Label>Имя</Form.Label>
                            <Form.Control
                              className=""
                              type="text"
                              onChange={(e) => setName(e.target.value)}
                              required
                              value={clientName}
                            />
                          </Form.Group>
                        </Col>
                        <Col lg="12" md="12">
                          <Form.Group className="mb-3" controlId="formBasicTel">
                            <Form.Label>Номер телефона</Form.Label>
                            <Form.Control
                              className=""
                              type="tel"
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              required
                              value={clientphoneNumber}
                            />
                          </Form.Group>
                        </Col>
                        <Col lg="12" md="12">
                          <Form.Group className="mb-3" controlId="formBasicRegion">
                            <Form.Label>Выберите регион</Form.Label>
                            <Form.Control className="" as="select" onChange={(e) => setRegion(e.target.value)} required >
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
                        </Col>
                        <Col lg="12" md="12">
                          <Form.Group className="mb-3" controlId="formBasicQuantity">
                            <Form.Label>Количество</Form.Label>
                            <Form.Control as="select" className="" onChange={(e) => setQuantity(e.target.value)} required >
                              <option selected value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>
                            </Form.Control>
                          </Form.Group>

                        </Col>
                      </Row>
                      <input type="hidden" className="" placeholder="product" value={order} />
                      <Row className="singleProductButtons">
                        {singleProduct.order_type === "all" ||
                          singleProduct.order_type === "" ||
                          singleProduct.order_type === "order" ? (
                          <Col lg="12" md="12" >
                            <Button className="zakazatButton" type="submit" variant="dark"  > Заказать </Button>
                          </Col>) : ("")}
                      </Row>
                    </Col>
                  </Row>
                </div>
              </form>
            </Col>
          </Row>
          <Row>

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
      <br />
      <Footer />
    </>
  );
};

export default SingleProduct;
