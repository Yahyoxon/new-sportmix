import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import "./singleproduct.scss";
import Footer from "../Footer/Footer";
import "../../components/Product/product.scss";
import axios from "axios";
import ReactHtmlParser from "react-html-parser";
import UserAgent from "user-agents";
import loading from '../../assets/3dgifmaker57938.gif'

const SingleProduct = ({ brands }) => {
  const { id } = useParams();
  const { oqim } = useParams();
  const [singleProductBrand, setSingleProductBrand] = useState({});
  const [clientName, setName] = useState("");
  const [region, setRegion] = useState("Ташкент");
  const [quantity, setQuantity] = useState("1");
  const [clientphoneNumber, setPhoneNumber] = useState("");
  const [singleProduct, setSingleProduct] = useState([]);
  const [successModal, setSuccessModal] = useState("forHidden");
  const [mainImage, setMainImage] = useState("");
  const userAgent = new UserAgent();

  useEffect(() => {
    (async () => {
      const res = await axios.get("https://geolocation-db.com/json/");
      if (res.data.IPv4 && userAgent && oqim) {
        console.log(res.data.IPv4);
        console.log(userAgent.data);
        console.log(oqim);
        await axios.post("https://api.sport-mix.uz/api/market/vawes/setVisited",{
          "visitor_ip":res.data.IPv4,
          "user_agent":userAgent.data.userAgent,
          "oqim_id":oqim
        })
      }
    })();
  }, [oqim]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `https://api.sport-mix.uz/api/products/readSingle?id=${id}`
        );
        setSingleProduct(response.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [id]);
  
  
  useEffect(() => {
    (async () => {
      try {
        for (let i = 0; i < brands.length; i++) {
          if (brands[i].link === singleProduct.brand_name) {
            setSingleProductBrand(brands[i]);
          }
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [brands, singleProduct.brand_name]);

  const onSubmitModal = async (e) => {
    e.preventDefault();
    const response = await axios.post(
      "https://api.sport-mix.uz/api/order/create",
      {
        product: singleProduct.name,
        username: clientName,
        phone: clientphoneNumber,
        region: region,
        quantity: quantity,
        cashback: singleProduct.cashback,
        total_price: singleProduct.price,
        brand_name: singleProduct.brand_name,
        image: singleProduct.images[0] || singleProduct.images[0],
        oqim: oqim || null,
      }
    );
    if ((response.data = "true")) {
      setName("");
      setRegion("");
      setQuantity("");
      setPhoneNumber("");
      setSuccessModal("modalSuccessSubmit");
    } else console.log(response);
  };

  return (
    <>
      <div className="viewComponent">
        {singleProduct?
        <Container>
          <Row>
            <Col className="centeredCol" lg="6" md="6" sm="12">
              {singleProduct.images && (
                <div className="main-image">
                  <img
                    className="oneImage"
                    src={mainImage || singleProduct.images[0]}
                    alt={singleProduct.name}
                  />
                </div>
              )}
              <div className="images-gallery">
                {singleProduct.images &&
                  singleProduct.images.map((image, i) => {
                    return (
                      <img
                        key={i}
                        src={image}
                        alt=""
                        onClick={() => setMainImage(image)}
                      />
                    );
                  })}
              </div>
            </Col>

            <Col lg="6" md="6" sm="12" className="centeredCol">
              <h3 className="title">{singleProduct.name}</h3>
              <div className="brandsBox">
                <div className="imageBoxSingle">
                  <Link to={`/${singleProductBrand.link}`}>
                    <img
                      src={singleProductBrand.image}
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
                  <p className="price">
                    {Number(singleProduct.price).toLocaleString()}сум
                  </p>
                </Col>
              </Row>
              <p className="desc">
                <span>
                  Описание
                  <br />
                </span>
                <br />
                {ReactHtmlParser(singleProduct.description)}
              </p>

              <form onSubmit={onSubmitModal}>
                <br />
                <div>
                  <label className="mb-1" htmlFor="">
                    <h4>
                      <strong>Закажите прямо сейчас</strong>
                    </h4>
                  </label>

                  <Row>
                    <Col lg="6">
                      <Row>
                        <Col lg="12" md="12">
                          <Form.Group
                            className="mb-3"
                            controlId="formBasicName"
                          >
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
                          <Form.Group
                            className="mb-3"
                            controlId="formBasicRegion"
                          >
                            <Form.Label>Выберите регион</Form.Label>
                            <Form.Control
                              className=""
                              as="select"
                              defaultValue="Ташкент"
                              onChange={(e) => setRegion(e.target.value)}
                              required
                            >
                              <option selected value="Ташкент">
                                Ташкент
                              </option>
                              <option value="Ташкентская область">
                                Ташкентская область{" "}
                              </option>
                              <option value="Андижанская область">
                                Андижанская область
                              </option>
                              <option value="Бухарская область">
                                Бухарская область
                              </option>
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
                                Хорезмская область{" "}
                              </option>
                            </Form.Control>
                          </Form.Group>
                        </Col>
                        <Col lg="12" md="12">
                          <Form.Group
                            className="mb-3"
                            controlId="formBasicQuantity"
                          >
                            <Form.Label>Количество</Form.Label>
                            <Form.Control
                              as="select"
                              className=""
                              defaultValue="1"
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
                        </Col>
                      </Row>
                      <Row className="singleProductButtons">
                        <Col lg="12" md="12">
                          <Button
                            className="zakazatButton"
                            type="submit"
                            variant="dark"
                          >
                            Заказать
                          </Button>
                        </Col>
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
        </Container>:<img src={loading} alt=""/>}
      </div>
      <br />
      <Footer />
    </>
  );
};

export default SingleProduct;
