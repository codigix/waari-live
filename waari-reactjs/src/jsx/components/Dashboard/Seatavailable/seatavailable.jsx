import React, { useEffect, useState } from "react";

const Seatavailable = () => {
    return (
        <>
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-body">

                            <div className="theatre">
                                <div className="screen-side">
                                    <h3 className="select-text">Please select</h3>
                                </div>
                                <ul className="showcase mb-3">
                                    <li>
                                        <div className="seatavail"></div>
                                        <small>N/A</small>
                                    </li>
                                    <li>
                                        <div className="seatavail selected"></div>
                                        <small>Selected</small>
                                    </li>
                                    <li>
                                        <div className="seatavail occupied"></div>
                                        <small>Occupied</small>
                                    </li>
                                </ul>
                                <ol className="cabin">
                                    <li className="row row--1">
                                        <ol className="seats" type="A">
                                            <li className="seat">
                                                <input type="checkbox" id="1A" />
                                                <label for="1A">

                                                </label>
                                            </li>
                                            <li className="seat">
                                                <input type="checkbox" id="1B" />
                                                <label for="1B"></label>
                                            </li>
                                            <li className="seat">
                                                <input type="checkbox" id="1C" />
                                                <label for="1C"></label>
                                            </li>
                                            <li className="seat">
                                                <input type="checkbox" disabled id="1D" />
                                                <label for="1D"></label>
                                            </li>
                                            <li className="seat">
                                                <input type="checkbox" id="1E" />
                                                <label for="1E"></label>
                                            </li>
                                            <li className="seat">
                                                <input type="checkbox" id="1F" />
                                                <label for="1F"></label>
                                            </li>
                                            <li className="seat">
                                                <input type="checkbox" id="1G" />
                                                <label for="1G"></label>
                                            </li>
                                        </ol>
                                    </li>
                                    <li className="row row--2">
                                        <ol className="seats" type="A">
                                            <li className="seat">
                                                <input type="checkbox" id="2A" />
                                                <label for="2A"></label>
                                            </li>
                                            <li className="seat">
                                                <input type="checkbox" id="2B" />
                                                <label for="2B"></label>
                                            </li>
                                            <li className="seat">
                                                <input type="checkbox" id="2C" />
                                                <label for="2C"></label>
                                            </li>
                                            <li className="seat">
                                                <input type="checkbox" id="2D" />
                                                <label for="2D"></label>
                                            </li>
                                            <li className="seat">
                                                <input type="checkbox" id="2E" />
                                                <label for="2E"></label>
                                            </li>
                                            <li className="seat">
                                                <input type="checkbox" id="2F" />
                                                <label for="2F"></label>
                                            </li>
                                            <li className="seat">
                                                <input type="checkbox" id="2G" />
                                                <label for="2G"></label>
                                            </li>
                                        </ol>
                                    </li>
                                    <li className="row row--3">
                                        <ol className="seats" type="A">
                                            <li className="seat">
                                                <input type="checkbox" id="3A" />
                                                <label for="3A"></label>
                                            </li>
                                            <li className="seat">
                                                <input type="checkbox" id="3B" />
                                                <label for="3B"></label>
                                            </li>
                                            <li className="seat">
                                                <input type="checkbox" id="3C" />
                                                <label for="3C"></label>
                                            </li>
                                            <li className="seat">
                                                <input type="checkbox" id="3D" />
                                                <label for="3D"></label>
                                            </li>
                                            <li className="seat">
                                                <input type="checkbox" id="3E" />
                                                <label for="3E"></label>
                                            </li>
                                            <li className="seat">
                                                <input type="checkbox" id="3F" />
                                                <label for="3F"></label>
                                            </li>
                                            <li className="seat">
                                                <input type="checkbox" id="3G" />
                                                <label for="3G"></label>
                                            </li>
                                        </ol>
                                    </li>
                                    <li className="row row--4">
                                        <ol className="seats" type="A">
                                            <li className="seat">
                                                <input type="checkbox" id="4A" />
                                                <label for="4A"></label>
                                            </li>
                                            <li className="seat">
                                                <input type="checkbox" id="4B" />
                                                <label for="4B"></label>
                                            </li>
                                            <li className="seat">
                                                <input type="checkbox" id="4C" />
                                                <label for="4C"></label>
                                            </li>
                                            <li className="seat">
                                                <input type="checkbox" id="4D" />
                                                <label for="4D"></label>
                                            </li>
                                            <li className="seat">
                                                <input type="checkbox" id="4E" />
                                                <label for="4E"></label>
                                            </li>
                                            <li className="seat">
                                                <input type="checkbox" id="4F" />
                                                <label for="4F"></label>
                                            </li>
                                            <li className="seat">
                                                <input type="checkbox" id="4G" />
                                                <label for="4G"></label>
                                            </li>
                                        </ol>
                                    </li>
                                    <li className="row row--5">
                                        <ol className="seats" type="A">
                                            <li className="seat">
                                                <input type="checkbox" id="5A" />
                                                <label for="5A"></label>
                                            </li>
                                            <li className="seat">
                                                <input type="checkbox" id="5B" />
                                                <label for="5B"></label>
                                            </li>
                                            <li className="seat">
                                                <input type="checkbox" id="5C" />
                                                <label for="5C"></label>
                                            </li>
                                            <li className="seat">
                                                <input type="checkbox" id="5D" />
                                                <label for="5D"></label>
                                            </li>
                                            <li className="seat">
                                                <input type="checkbox" id="5E" />
                                                <label for="5E"></label>
                                            </li>
                                            <li className="seat">
                                                <input type="checkbox" id="5F" />
                                                <label for="5F"></label>
                                            </li>
                                            <li className="seat">
                                                <input type="checkbox" id="5G" />
                                                <label for="5G"></label>
                                            </li>
                                        </ol>
                                    </li>
                                    <li className="row row--6">
                                        <ol className="seats" type="A">
                                            <li className="seat">
                                                <input type="checkbox" id="6A" />
                                                <label for="6A"></label>
                                            </li>
                                            <li className="seat">
                                                <input type="checkbox" id="6B" />
                                                <label for="6B"></label>
                                            </li>
                                            <li className="seat">
                                                <input type="checkbox" id="6C" />
                                                <label for="6C"></label>
                                            </li>
                                            <li className="seat">
                                                <input type="checkbox" id="6D" />
                                                <label for="6D"></label>
                                            </li>
                                            <li className="seat">
                                                <input type="checkbox" id="6E" />
                                                <label for="6E"></label>
                                            </li>
                                            <li className="seat">
                                                <input type="checkbox" id="6F" />
                                                <label for="6F"></label>
                                            </li>
                                            <li className="seat">
                                                <input type="checkbox" id="6G" />
                                                <label for="6G"></label>
                                            </li>
                                        </ol>
                                    </li>

                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};
export default Seatavailable;
