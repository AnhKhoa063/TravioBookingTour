import React, { useEffect, useState } from 'react';
import API, { endpoints } from '../API';
import { Link } from 'react-router-dom';
import BannerSection from '../components/home/BannerSection';
import PlaceSection from '../components/home/PlaceSection';
import FeatureSection from '../components/home/FeatureSection';

import shape4 from "../static/image/shape/shape-4.png";
import shape10 from "../static/image/shape/shape-10.png";
import PreLoader from '../components/PreLoader';

export default function Home(props) {
    const [tourList, setTourList] = useState([]);
    const [listBlog, setListBlog] = useState([]);
    
    useEffect(() => {
        let loadPopularTour = async () => {
            try {
                let res = await API.get(endpoints['popular-tours']);
                setTourList(res.data);
            } catch (error) {
                console.error(error);
            }
        }
        let loadNewestBlogs = async () => {
            try {
                let res = await API.get(endpoints['newest-blogs']);
                setListBlog(res.data);
            } catch (error) {
                console.error(error);
            }
        }
        
        loadNewestBlogs();
        loadPopularTour();
    }, [])

    if (tourList.length === 0 || listBlog.length === 0) {
        return <PreLoader />
    }

    return (
        <>
            <BannerSection />
            <FeatureSection />
            
            {/* TourSection */}
            <section className="tour-section bg-color-1 sec-pad">
                <div className="pattern-layer" style={{
                    backgroundImage: `url(${shape4})`
                }}
                />
                <div className="auto-container">
                    <div className="sec-title text-center">
                        <p>Hiện Đại & Tuyệt Đẹp</p>
                        <h2>Những Tour Phổ Biến</h2>
                    </div>
                    <div className="row clearfix">
                        {tourList.map(t => <TourItem key={t.id} tour={t} />)}
                    </div>
                </div>
            </section>
            {/* End TourSection */}
            <PlaceSection />
            
            {/* NewSection */}
            <section className="news-section sec-pad pb-220">
                <div
                    className="pattern-layer"
                    style={{
                        backgroundImage: `url(${shape10})`
                    }}
                />
                <div className="auto-container">
                    <div className="sec-title">
                        <p>Tin tức & Bài viết</p>
                        <h2>Cập nhật với Travio</h2>
                        <Link to="/blogs" className="theme-btn-two">
                            Tất cả tin tức
                        </Link>
                    </div>
                    <div className="row clearfix">
                        {listBlog.map(b => <BlogItem key={b.id} blog={b} />)}
                    </div>
                </div>
            </section>
            {/* End NewSection */}
        </>
    );
}

class TourItem extends React.Component {
    render() {
        return (
            <>
                <div className="col-lg-4 col-md-6 col-sm-12 tour-block">
                    <div className="tour-block-one wow fadeInUp animated animated" data-wow-delay="600ms" data-wow-duration="1500ms">
                        <div className="inner-box">
                            <figure className="image-box">
                                <img src={this.props.tour.image} alt="ImageTour" />
                                <a href={'/tour-detail/' + this.props.tour.id}>
                                    <i className="fas fa-link" />
                                </a>
                            </figure>
                            <div className="lower-content">
                                <div className="rating">
                                    <span>
                                        <i className="fas fa-star" />
                                        {this.props.tour.rating}
                                    </span>
                                </div>
                                <h3 data-toggle="tooltip" title={this.props.tour.tour_name}> 
                                    <a href={'/tour-detail/' + this.props.tour.id}>{this.props.tour.tour_name}</a>
                                </h3>
                                <h4>
                                    {this.props.tour.price_of_tour.toLocaleString(navigator.language, { minimumFractionDigits: 0 })}<span> / 1 người</span>
                                </h4>
                                <ul className="info clearfix">
                                    <li>
                                        <i className="far fa-clock" />{this.props.tour.duration}
                                    </li>
                                    <li>
                                        <i className="far fa-map" />
                                        {this.props.tour.departure}
                                    </li>
                                </ul>
                                <div className="btn-box">
                                    <a href={'/tour-detail/' + this.props.tour.id}>Xem chi tiết</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

class BlogItem extends React.Component {
    render() {
        return (
            <div className="col-lg-4 col-md-6 col-sm-12 news-block">
                <div className="news-block-one wow fadeInUp animated animated" data-wow-delay="00ms" data-wow-duration="1500ms">
                    <div className="inner-box">
                        <figure className="image-box">
                            <Link to={"/blog-details/" + this.props.blog.id}>
                                <img src={this.props.blog.image} alt="" />
                            </Link>
                            <span className="post-date">
                                <i className="far fa-calendar-alt" />{this.props.blog.created_date}
                            </span>
                        </figure>
                        <div className="lower-content">
                            <div className="category">
                                <Link to={"/blog-details/" + this.props.blog.id}>Lifestyle</Link>
                            </div>
                            <h3 style={{ height: "90px" }}>
                                <Link to={"/blog-details/" + this.props.blog.id}>
                                    {this.props.blog.title}
                                </Link>
                            </h3>
                            <ul className="post-info clearfix">
                                <li>
                                    <span>Theo</span> <Link to={"/blog-details/" + this.props.blog.id}>{this.props.blog.author}</Link>
                                </li>
                                <li> - {this.props.blog.created_date}</li>
                            </ul>
                            <div className="btn-box">
                                <Link to={"/blog-details/" + this.props.blog.id} className="theme-btn-two">
                                    Xem chi tiết
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}