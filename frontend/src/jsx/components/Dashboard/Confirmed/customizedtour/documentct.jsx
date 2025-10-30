import React, { useEffect, useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import { get } from "../../../../../services/apiServices";
import DocumentsView from "./DocumentsView";

const DocumentCT = ({ enquiryId }) => {
	const [familyHeadsList, setFamilyHeadsList] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const [familyHeadTab, setFamilyHeadTab] = useState(familyHeadsList[0]?.path);


	const getFamilyHeadsList = async () => {
		try {
			setIsLoading(true);
			const reponse = await get(
				`/familyHead-list-ct?enquiryCustomId=${enquiryId}`
			);

			const transformedFamilyHeadsList = reponse.data?.data.map((fHead) => ({
				enquiryDetailCustomId: fHead.enquiryDetailCustomId,
				familyHeadName: fHead.preFixName + fHead.firstName + fHead.lastName,
				path: fHead.firstName + fHead.lastName,
				label: fHead.preFixName + " " + fHead.firstName + " " + fHead.lastName,
			}));

			setFamilyHeadTab(transformedFamilyHeadsList[0].path);

			setFamilyHeadsList(transformedFamilyHeadsList);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		getFamilyHeadsList();
	}, []);


	return (

			<div className="card ">
				<div className="card-body">
					<div className="card-header mb-2 p-0" style={{ paddingLeft: "0" }}>
						<div className="card-title h5">Documents</div>
                    </div>
                    
                    <Tab.Container defaultActiveKey={familyHeadTab}>
						<div className="row">
							<div className="col-md-12">
								<div className="d-flex justify-content-between align-items-center flex-wrap">
									<div className="card-action customer-tabs">
										<div className="nav nav-tabs">
											{familyHeadsList.length > 0 &&
												familyHeadsList.map((item) => (
													<div
														key={item.enquiryDetailCustomId}
														className={`nav-item cursor-pointer`}
														onClick={() => {
															// setURLSearchParams({ familyHeadTab: item.path });
															setFamilyHeadTab(item.path);
														}}
													>
														<div
															className={`nav-link  ${
																familyHeadTab === item.path ? "active" : ""
															}`}
														>
															{item.label}
														</div>
													</div>
												))}
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="tab-content-done">
				
								{familyHeadsList.length > 0 &&
									familyHeadsList.map((fHead) => (
										<div key={fHead.enquiryDetailCustomId}>
													{/* Render Bookingformnew with conditional rendering based on selected family head */}
												{familyHeadTab == fHead.path && (
													<DocumentsView
														key={fHead.enquiryDetailCustomId}
														familyHead={fHead}
														enquiryId={enquiryId}
													/>
												)}
											</div>
									))}
							
						</div>
                    </Tab.Container>
				</div>
			</div>
	
	);
};
export default DocumentCT;
