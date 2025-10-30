import React, { useEffect, useState } from "react";
import { get, post } from "../../../../../services/apiServices";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";

const RoomingCT = ({ enquiryId, familyHead }) => {
	const [isLoading, setIsLoading] = useState(false);
	
	useEffect(() => {
		const getRoomsDetails = async () => {
			const response = await get(
				`/room-share-family-head-ct?enquiryDetailCustomId=${familyHead.enquiryDetailCustomId}&enquiryCustomId=${enquiryId}`
			);

			return response.data?.data;
		};

		const fetchData = async () => {
			const roomDetails = await getRoomsDetails();

			roomDetails.forEach((element, index) => {
				validation.setFieldValue(
					`roomsArray[${index}].roomShareId`,
					element?.roomShareId ?? null
				);

				validation.setFieldValue(
					`roomsArray[${index}].roomShareName`,
					element?.roomShareName ?? null
				);

				validation.setFieldValue(
					`roomsArray[${index}].count`,
					Number(element?.count) ?? null
				);
			});
		};

		fetchData();
	}, []);

	const validationSchema = Yup.object().shape({
		roomsArray: Yup.array().of(
			Yup.object().shape({
				count: Yup.number("Room Count must be a number")
					.integer("Room Count must be an integer")
					.required("Room Count is required"),
			})
		),
	});

	const validation = useFormik({
		enableReinitialize: true,
		initialValues: {
			roomsArray: [
				{
					roomShareId: null,
					roomShareName: "",
					count: 0,
				},
			],
		},

		validationSchema,

		// onSubmit: async (values) => {

		// 	const totalRoomCount = values.roomsArray.reduce(
		// 		(accumulator, room) => accumulator + room.count,
		// 		0
		// 	  );
			
		// 	const maxRoomCountFromProps = familyHead.paxNo; 
			
			
		// 	  if (totalRoomCount !== maxRoomCountFromProps) {
		// 		toast.error('Total room count must match number of pax for this family head.');
		// 		return;
		// 	  }
			
			
		// 	let data = {
		// 		enquiryCustomId: enquiryId,
		// 		enquiryDetailCustomId: familyHead.enquiryDetailCustomId,

		// 		roomsArray: values.roomsArray.map((room) => ({
		// 			roomShareId: room.roomShareId,
		// 			roomShareName: room.roomShareName,
		// 			count: room.count,
		// 		})),
		// 	};

		// 	try {
		// 		console.log("data:", data);

		// 		// Before Submitting data, add a validation to check total count of all should be equal to pax number entered

		// 		setIsLoading(true);

		// 		const response = await post(`/store-room-share-family-head-ct`, data);
		// 		setIsLoading(false);
		// 		toast.success(response?.data?.message);
				
		// 	} catch (error) {
		// 		setIsLoading(false);
		// 		console.log(error);
		// 	}
		// },
	});


	const handleRoomCountChange = (countValue, index) => {
		validation.setFieldValue(
		  `roomsArray[${index}].count`,
		  Number(countValue)
		);
	  };
	  
	  const handleRoomIncreament = (index) => {
		validation.setFieldValue(
		  `roomsArray[${index}].count`,
		  validation.values.roomsArray[index].count + 1
		);
	  };
	  
	  const handleRoomDecreament = (index) => {
		const currentCount = validation.values.roomsArray[index].count;
		validation.setFieldValue(
		  `roomsArray[${index}].count`,
		  currentCount > 0 ? currentCount - 1 : 0
		);
	  };
	  

	console.log("validation", validation.values);
	return (
		<>
			<section>
				<form className="needs-validation"
				// 	onSubmit={(e) => {
				// 		e.preventDefault();
				// 		validation.handleSubmit();
				// 		return false;
				// }}
				>
					<div className="card-header mb-2 p-0 " style={{ paddingLeft: "0" }}>
						<div className="card-title h6 text-center">Rooms</div>
					</div>
					<div className="row">
						{validation.values.roomsArray.length > 0 &&
							validation.values.roomsArray.map((room, index) => (
								<div className="col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-2" key={room.roomShareId}>
									<div className="row">
										<div className="col-md-6 col-lg-6 col-sm-12">
											<label className="text-label" >
												{room.roomShareName}
											</label>
										</div>
										<div className="col-md-6 col-lg-6 col-sm-12">
											<div className="adult-room">
												<button
													disabled
													type="button"
													// onClick={() => handleRoomDecreament(index)}
													className="room__minus"
												>
													<span>-</span>
												</button>
												<input
													disabled
													name="room"
													type="number"
													className="room__input"
													value={room.count}
													onChange={(e, index) => handleRoomCountChange(e.target.value, index)}
												/>
												<button
													disabled
													type="button"
													// onClick={() => handleRoomIncreament(index)}
													className="room__plus"
												>
													<span>+</span>
												</button>
											</div>
										</div>
									</div>
								</div>
							))}

					
					</div>
					{/* <div className="mb-2 mt-2 row">
						<div className="col-lg-12 d-flex justify-content-end">
							<button type="submit" className="btn btn-submit btn-primary">
								Save
							</button>
						</div>
					</div> */}
				</form>
			</section>
		</>
	);
};
export default RoomingCT;
