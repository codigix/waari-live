import React, { useEffect } from "react";
import { Tab, Nav } from "react-bootstrap";
import Guestdetails from "./guestdetails";
import Arrivaldetails from "./arrivaldetails";
import Tourcost from "./tourcost";
import Payment from "./payment";
import Rooming from "./rooming";
const Bookingformnew = ({ familyHead, enquiryId }) => {
    
    return (
        <>
            <Tab.Container defaultActiveKey="All">

                <div className="row">
                    <div className="col-md-12">
                        <div className="d-flex justify-content-between align-items-center flex-wrap">
                            <div className="card-action booking-tabs mb-2 mt-2">
                                <Nav as="ul" className="nav nav-tabs">
                                    <Nav.Item as="li" className="nav-item">
                                        <Nav.Link className="nav-link" eventKey="All">
                                            Arrival Details
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item as="li" className="nav-item">
                                        <Nav.Link className="nav-link" eventKey="rooming">
                                            Rooming
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item as="li" className="nav-item">
                                        <Nav.Link className="nav-link" eventKey="guestdetails">
                                            Guest Details
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item as="li" className="nav-item">
                                        <Nav.Link className="nav-link" eventKey="tourcost">
                                            Tour Cost
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item as="li" className="nav-item">
                                        <Nav.Link className="nav-link" eventKey="payment">
                                            Payment
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </div>
                        </div>
                    </div>
                </div>

                <Tab.Content>
                    <Tab.Pane eventKey="All">
                        <div className="row">
                            <div className="col-xl-12 col-xxl-12">
                                <Arrivaldetails enquiryId={enquiryId} familyHead={familyHead} />
                            </div>
                        </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="rooming">
                        <div className="row">
                            <div className="col-xl-12 col-xxl-12">
                                <Rooming enquiryId={enquiryId} familyHead={familyHead} />
                            </div>
                        </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="guestdetails">
                        <div className="row">
                            <div className="col-xl-12 col-xxl-12">
                                <Guestdetails enquiryId={enquiryId} familyHead={familyHead} />
                            </div>
                        </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="tourcost">
                        <div className="row">
                            <div className="col-xl-12 col-xxl-12">
                                <Tourcost enquiryId={enquiryId} familyHead={familyHead} />
                            </div>
                        </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="payment">
                        <div className="row">
                            <div className="col-xl-12 col-xxl-12">
                                <Payment enquiryId={enquiryId} familyHead={familyHead} />
                            </div>
                        </div>
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </>
    );
};
export default React.memo(Bookingformnew);
