import React, { useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import Viewsalestarget from "./viewsalestarget";
import BackButton from "../../common/BackButton";



const Setsalestarget = () => {
  const previousYear = new Date().getFullYear() - 1
  const currentYear = new Date().getFullYear()
  const upcommingYear = new Date().getFullYear() + 1
  const tabs = [previousYear, currentYear, upcommingYear]
  const [active, setActive] = useState(currentYear)

  return (
    <>
      <div className="card"  style={{ marginBottom: '40px' }}>
        <div className="row page-titles mx-0 fixed-top-breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <BackButton />
            </li>
            <li className="breadcrumb-item active">
              <Link to="/dashboard">Dashboard</Link>
            </li>

            <li className="breadcrumb-item  ">
              <Link to="javascript:void(0)">Set Sales Target</Link>
            </li>
          </ol>
        </div>
      </div>
      <Tab.Container activeKey={active}>
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-md-12 col-lg-4 col-sm-12 col-12">
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                  <div className="card-action coin-tabs">
                    <Nav as="ul" className="nav nav-tabs">
                      {
                        tabs.map((item, index) =>
                          <Nav.Item as="li" className="nav-item" key={index}>
                            <Nav.Link className="nav-link" onClick={() => setActive(item)} eventKey={item}>
                              year- {item}
                            </Nav.Link>
                          </Nav.Item>
                        )
                      }
                    </Nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Tab.Content>
          {
            tabs.map((item, index) =>
              <Tab.Pane eventKey={item} key={index}>
                {
                  item == active &&
                  <div className="row">
                    <div className="col-xl-12 col-xxl-12">
                      <Viewsalestarget year={item} />
                    </div>
                  </div>
                }
              </Tab.Pane>
            )}

        </Tab.Content>
      </Tab.Container>
    </>
  );
};
export default Setsalestarget;
