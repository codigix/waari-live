import React, { useEffect } from "react";
import { Tab, Nav } from "react-bootstrap";
import Canceltourform from "./canceltourform"
const Canceltour = () => {




    return (
        <>
            <div className="card">
                <div className="card-body">
                    <Tab.Container defaultActiveKey="All">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="d-flex justify-content-between align-items-center flex-wrap">
                                    <div className="card-action customer-tabs">
                                        <Nav as="ul" className="nav nav-tabs">
                                            <Nav.Item as="li" className="nav-item">
                                                <Nav.Link className="nav-link" eventKey="All">
                                                    Rishikesh Musmade
                                                </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item as="li" className="nav-item">
                                                <Nav.Link className="nav-link" eventKey="Pending">
                                                    Charudatta Musmade
                                                </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item as="li" className="nav-item">
                                                <Nav.Link className="nav-link" eventKey="Done">
                                                    Maruti Musmade
                                                </Nav.Link>
                                            </Nav.Item>
                                        </Nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="tab-content-done">
                         <Tab.Content>
                            <Tab.Pane eventKey="All">
                                <div className="row">
                                    <div className="col-xl-12 col-xxl-12">
                                        <Canceltourform />
                                    </div>
                                </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="Pending">
                                <div className="row">
                                    <div className="col-xl-12 col-xxl-12">
                                        <Canceltourform />
                                    </div>
                                </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="Done">
                                <div className="row">
                                    <div className="col-xl-12 col-xxl-12">
                                        <Canceltourform />
                                    </div>
                                </div>
                            </Tab.Pane>
                        </Tab.Content>
                        </div>
                    </Tab.Container>
                </div>
            </div>
        </>
    );
};
export default Canceltour;
