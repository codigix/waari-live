import React, { useEffect, useState } from "react";
import { get } from "../../../../../services/apiServices";
import { Tooltip } from "@mui/material";

const DocumentsView = ({ enquiryId, familyHead }) => {
	const [documents, setDocuments] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const getDocuments = async () => {
		try {
			setIsLoading(true);
			const response = await get(
				`/guests-document-gt?familyHeadGtId=${familyHead.familyHeadGtId}`
			);

			setDocuments(response.data?.data);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		getDocuments();
	}, []);


	return (
		<section>
			<table className="table table-bordered table-responsive-sm table-tour table-head mt-2">
				<thead>
					<tr>
						<th>Name</th>
						<th>Aadhar card no</th>
						<th>pan card</th>
						<th>Passport</th>
						<th>Passport Issue Date</th>
						<th>Passport Expiry Date</th>
						{/* <th></th> */}
					</tr>
				</thead>
				<tbody>
					{documents.length > 0 ? (
						documents.map((doc) => (
							<tr key={doc.adharCard}>
								<td>{doc.familyHeadName}</td>
								<td>
									<a
										target="_blank"
										href={doc.adharCard}
										style={{ color: "#4B0082", cursor: "pointer" }}
										className="document-link"
									>
										<span className="me-2">{doc.adharNo}</span>
										{doc.adharNo ? (
											<Tooltip title="View">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												height="12px"
												width="12px"
												viewBox="0 0 512 512"
												style={{ fill: "#076fb0" }}
											>
												<path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z" />
											</svg>
											</Tooltip>
										) : (
											"-"
										)}
									</a>
								</td>
								<td>
									<a
										target="_blank"
										href={doc.pan}
										style={{ color: "#4B0082", cursor: "pointer" }}
										className="document-link"
									>
										<span className="me-2">{doc.panNo}</span>
										{doc.panNo ? (
												<Tooltip title="View">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												height="12px"
												width="12px"
												viewBox="0 0 512 512"
												style={{ fill: "#076fb0" }}
											>
												<path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z" />
											</svg>
											</Tooltip>
										) : (
											"-"
										)}
									</a>
								</td>
								<td>
									<a
										target="_blank"
										href={doc.passport}
										style={{ color: "#4B0082", cursor: "pointer" }}
										className="document-link"
									>
										<span className="me-2">{doc.passportNo}</span>
										{doc.passportNo ? (
												<Tooltip title="View">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												height="12px"
												width="12px"
												viewBox="0 0 512 512"
												style={{ fill: "#076fb0" }}
											>
												<path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z" />
											</svg>
											</Tooltip>
										) : (
											"-"
										)}
									</a>
								</td>
								<td>{doc.passport_issue_date || "-"}</td>
								<td>{doc.passport_expiry_date || "-"}</td>
							</tr>
						))
					) : (
						<tr className="text-center">No Data Available</tr>
					)}
				</tbody>
			</table>
		</section>
	);
};

export default DocumentsView;
