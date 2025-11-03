import React, { useEffect, useState } from "react";
import { get, post } from "../../../../../services/apiServices";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";

const Rooming = ({ enquiryId, familyHead, callbackOnSuccess, redirectForwandOnSuccess }) => {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [alreadyRoomsAdded, setAlreadyRoomsAdded] = useState(true);
	
	useEffect(() => {
		
		const getRoomsDetails = async () => {
			const response = await get(
				`/room-share-family-haed-gt?familyHeadGtId=${familyHead.familyHeadGtId}&enquiryGroupId=${enquiryId}`
			);

			setAlreadyRoomsAdded(response.data.alreadyRoomsAdded)

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

		onSubmit: async (values) => {

			const totalRoomCount = values.roomsArray.reduce(
				(accumulator, room) => accumulator + room.count,
				0
			  );
			
			const maxRoomCountFromProps = familyHead.paxNo; 
			
			
			  if (totalRoomCount !== maxRoomCountFromProps) {
				toast.error('Total room count must match number of pax for this family head.');
				return;
			  }
			
			
			let data = {
				enquiryGroupId: enquiryId,
				familyHeadGtId: familyHead.familyHeadGtId,

				roomsArray: values.roomsArray.map((room) => ({
					roomShareId: room.roomShareId,
					roomShareName: room.roomShareName,
					count: room.count,
				})),
			};

			try {
				// Before Submitting data, add a validation to check total count of all should be equal to pax number entered

				setIsSubmitting(true);

				const response = await post(`/store-room-share-family-haed-gt`, data);
				callbackOnSuccess(redirectForwandOnSuccess)
				
				setIsSubmitting(false);
				toast.success(response?.data?.message);
				
			} catch (error) {
				setIsSubmitting(false);
				console.log(error);
			}
		},
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
	  

	return (
		<>
			<section>
				<form className="needs-validation pt-2"
					onSubmit={(e) => {
						e.preventDefault();
						validation.handleSubmit();
						return false;
				}}
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
													type="button"
													onClick={() => handleRoomDecreament(index)}
													className="room__minus"
												>
													<span>-</span>
												</button>
												<input
													name="room"
													type="number"
													className="room__input"
													value={room.count}
													onChange={(e, index) => handleRoomCountChange(e.target.value, index)}
												/>
												<button
													type="button"
													onClick={() => handleRoomIncreament(index)}
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
					{alreadyRoomsAdded ? "" : <div className="mb-2 mt-2 row">
						<div className="col-lg-12 d-flex justify-content-end">
							<button type="submit" className="btn btn-submit btn-primary" disabled={isSubmitting}>
							{ isSubmitting ?"Saving..." : "Save"}
							</button>
						</div>
					</div>}
				</form>
			</section>
		</>
	);
};
export default Rooming;
