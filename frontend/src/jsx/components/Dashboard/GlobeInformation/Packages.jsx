import React from "react";
import City from "./City";
import Country from "./Country";
import State from "./State";
import { Tab, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import BackButton from "../../common/BackButton";
import Sector from "./Sector";

const Packages = () => {
  return (
    <>
      <div className="card"  style={{ marginBottom: '40px' }}>
        <div className="row page-titles mx-0 fixed-top-breadcrumb">
          <ol className="breadcrumb">
         
            <li className="breadcrumb-item active">
              <Link to="/dashboard">Dashboard</Link>
            </li>

            <li className="breadcrumb-item  ">
              <Link to="/globe-information">Globe Information</Link>
            </li>
          </ol>
        </div>
      </div>
      <Tab.Container defaultActiveKey="All">
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-md-12 col-lg-12 col-sm-12 col-12">
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                  <div className="card-action coin-tabs">
                    <Nav as="ul" className="nav nav-tabs">
                      <Nav.Item as="li" className="nav-item">
                        <Nav.Link className="nav-link" eventKey="All">
                          Country
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item as="li" className="nav-item">
                        <Nav.Link className="nav-link" eventKey="Pending">
                          State
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item as="li" className="nav-item">
                        <Nav.Link className="nav-link" eventKey="Done">
                          City
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item as="li" className="nav-item">
                        <Nav.Link className="nav-link" eventKey="sector">
                          Sector
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Tab.Content>
          <Tab.Pane eventKey="All">
            <div className="row">
              <div className="col-xl-12 col-xxl-12">
                <Country />
              </div>
            </div>
          </Tab.Pane>
          <Tab.Pane eventKey="Pending">
            <div className="row">
              <div className="col-xl-12 col-xxl-12">
                <State />
              </div>
            </div>
          </Tab.Pane>
          <Tab.Pane eventKey="Done">
            <div className="row">
              <div className="col-xl-12 col-xxl-12">
                <City />
              </div>
            </div>
          </Tab.Pane>
          <Tab.Pane eventKey="sector">
            <div className="row">
              <div className="col-xl-12 col-xxl-12">
                <Sector />
              </div>
            </div>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </>
  );
};
export default Packages;
