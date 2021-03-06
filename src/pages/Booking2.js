import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import API, { endpoints } from '../API';
import PreLoader from '../components/PreLoader';
import PayContext from '../context/PayContext';
import WOW from 'wowjs';

import pageTitle5 from '../static/image/background/page-title-5.jpg';
import logoZaloPay from '../static/image/card/logo-zalopay.svg';
import MessageSnackbar from '../components/MessageSnackbar';

function Booking2(props) {
    const history = useHistory();
    const { tourId } = useParams();
    const payDetails = useContext(PayContext);
    const [tour, setTour] = useState([]);
    const [note, setNote] = useState("");
    const [payments, setPayments] = useState("");

    // State of message
    const [open, setOpen] = React.useState(false);
    const [msg, setMsg] = useState('');
    const [typeMsg, setTypeMsg] = useState('');
    const [titleMsg, setTitleMsg] = useState('');

    const handleMessageClose = () => {
        setOpen(false);
    };

    const createMessage = (title, msg, type) => {
        setMsg(msg);
        setTitleMsg(title);
        setTypeMsg(type);
    }
    // End message

    useEffect(() => {
        new WOW.WOW({live: false}).init();
    }, [])

    const handleSubmit = (event) => {
        event.preventDefault();
        
        const submitPayment = async () => {
            const formData = new FormData();
            formData.append('total_amount', payDetails.total);
            formData.append('tour_id', tourId);
            formData.append('note', note);
            formData.append('payer_id', payDetails.payerId);
            formData.append('status_payment', "0");
            let invId = "";
            let urlPayment = "";
            let paymentType = "";
            
            try {
                let res = await API.post(`${endpoints['payers']}${payDetails.payerId}/add-invoice/`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                if(res.data.id !== null) {
                    invId = res.data.id;
                    formData.append('invoice_id', res.data.id);
                }
                
                if (payments === "1") { 
                    paymentType = 'momo-payment';
                } else if (payments === "3") {
                    paymentType = 'zalopay-payment';
                }
                
                if (paymentType !== "") {
                    let res = await API.post(endpoints[paymentType], formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    urlPayment = res.data.orderUrl;
                }
                
                if (urlPayment !== "") {
                    window.location.href = urlPayment;
                } else {
                    history.push(`/tour-detail/${tourId}/booking-3/${invId}/${2}/confirm`);
                }
            } catch (error) {
                console.error(error);
            }
        }
        
        if (payments !== "") {
            submitPayment();
        } else {
            setOpen(true);
            createMessage('C???nh b??o', 'Vui l??ng ch???n ph????ng th???c thanh to??n !', 'warning');
        }
    }

    useEffect(() => {
        let getTour = async () => {
            try {
                let res = await API.get(endpoints['tour-details'](tourId))
                setTour(res.data)
            } catch (error) {
                console.error(error);
            }
        }
        getTour()
    }, [tourId])

    if (tour.length ===  0) {
        return <PreLoader />
    }

    return (
        <>
            <section className="page-title centred" style={{ backgroundImage: `url(${pageTitle5})` }}>
                <div className="auto-container">
                    <div className="content-box wow fadeInDown animated animated"
                        data-wow-delay="00ms"
                        data-wow-duration="1500ms">
                        <h1>Thanh To??n</h1>
                        <p>Kh??m ph?? cu???c phi??u l??u tuy???t v???i ti???p theo c???a b???n</p>
                    </div>
                </div>
            </section>
            
            <section className="booking-section booking-process-2">
                <div className="auto-container">
                    <div className="row clearfix">
                        <div className="col-lg-8 col-md-12 col-sm-12 content-side">
                            <div className="booking-process-content mr-20">
                                <ul className="process-label clearfix">
                                    <li>
                                        <span>1.</span>Nh???p th??ng tin
                                    </li>
                                    <li className="current">
                                        <span>2.</span>Thanh to??n
                                    </li>
                                    <li>
                                        <span>3.</span>X??c nh???n
                                    </li>
                                </ul>
                                <div className="inner-box">
                                    <form onSubmit={handleSubmit} className="processing-form">
                                        <div className="row clearfix">
                                            <div className="col-lg-12 col-md-12 col-sm-12 column">
                                                <div className="form-group">
                                                    <label>Ghi ch??</label>
                                                    <textarea 
                                                        id="message"
                                                        value={note} 
                                                        onChange={(event) => setNote(event.target.value)} 
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="payment-option">
                                            <h3>Ch???n H??nh Th???c Thanh To??n</h3>
                                            <div className="row clearfix">
                                                <div className="col-lg-6 col-md-6 col-sm-12 column">
                                                    <FormControl component="fieldset">
                                                        <RadioGroup
                                                            aria-label="payment"
                                                            name="radio-buttons-group"
                                                            value={payments}
                                                            onChange={(event) => setPayments(event.target.value)}
                                                        >
                                                            <FormControlLabel 
                                                                value="2" 
                                                                control={<Radio />} 
                                                                label="Thanh to??n ti???n m???t t???i qu???y" 
                                                            />
                                                            <FormControlLabel 
                                                                value="1" 
                                                                control={<Radio />} 
                                                                label={<>Thanh to??n b???ng V?? <img style={{width: '30px'}} src="https://developers.momo.vn/v2/images/logo.svg" alt="Momo"/></>} 
                                                            />
                                                            <FormControlLabel 
                                                                value="3" 
                                                                control={<Radio />} 
                                                                label={<>Thanh to??n b???ng V?? <img src={logoZaloPay} alt="ZaloPay"/></>} 
                                                            />
                                                        </RadioGroup>
                                                    </FormControl>
                                                </div>
                                                <div className="col-lg-12 col-md-12 col-sm-12 column">
                                                    <div className="form-group message-btn clearfix">
                                                        <Link to={"/tour-detail/" + tourId + "/booking-1"} className="theme-btn">
                                                            <i className="fas fa-angle-left" />
                                                            Tr??? l???i
                                                        </Link>
                                                        <button type="submit" className="theme-btn">
                                                            X??c nh???n
                                                            <i className="fas fa-angle-right" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-12 col-sm-12 sidebar-side">
                            <div className="process-sidebar ml-20">
                                <div className="content-box">
                                    <h3>Th??ng Tin</h3>
                                    <figure className="image-box">
                                        <img src={tour.image} alt="ImageSidebar" />
                                    </figure>
                                    <h4>{tour.tour_name}</h4>
                                    <ul className="info clearfix">
                                        <li>
                                            <i className="far fa-calendar-alt" />
                                            T???: <span>{tour.depart_date}</span>
                                        </li>
                                        <li>
                                            <i className="far fa-calendar-alt" />
                                            T???i: <span>??ang c???p nh???t</span>
                                        </li>
                                        <li>
                                            <i className="fas fa-user-alt" />
                                            Kh??ch: <span>{payDetails.adults} ng?????i l???n, {payDetails.childs} tr??? em</span>
                                        </li>
                                        <li>
                                            <i className="fas fa-money-bill" />
                                            Tr??? em: <span>{tour.price_of_tour_child} ??</span>
                                        </li>
                                        <li>
                                            <i className="fas fa-money-bill" />
                                            Ng?????i l???n: <span>{tour.price_of_tour} ??</span>
                                        </li>
                                        <li>
                                            <i className="fas fa-money-bill" />
                                            Ti???n ph??ng: <span>{tour.price_of_room} ??</span>
                                        </li>
                                    </ul>
                                    <div className="price">
                                        <h4>Total: {payDetails.total}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <MessageSnackbar
                handleClose={handleMessageClose}
                isOpen={open}
                msg={msg}
                type={typeMsg}
                title={titleMsg}
            />
        </>
    );
}

export default Booking2;