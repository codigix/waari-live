export const MenuList = [
    {
        title: "Dashboard",
        to: "dashboard",
        iconStyle: (
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
                <path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" />
            </svg>
        ),
        catId: 1,
    },

    //Boosttrap
    {
        title: "Tours",
        classsChange: "mm-collapse",
        iconStyle: (
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512">
                <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z" />
            </svg>
        ),
        catId: null,
        content: [
            {
                title: "Group Tours",
                to: "View-group-tour",
                catId: 8,
            },
            {
                title: "Group Tours (Drafts)",
                to: "view-draft-grouptours-list",
                catId: 8,
            },
            {
                title: "Customized Tours",
                to: "View-customized-tour",
                catId: 19,
            },
            {
                title: "TailorMade Tours",
                to: "tailormade-tours",
                catId: 59,
            },
        ],
    },

    {
        title: "Enquiry Follow-up",
        classsChange: "mm-collapse",
        iconStyle: (
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
            </svg>
        ),
        catId: null,
        content: [
            {
                title: "Group Tours Enquiries",
                to: "group-tour-new",
                catId: 2,
            },
            {
                title: "Customized Tours Enquiries",
                to: "customized-tour-new",
                catId: 3,
            },
            {
                title: "All Group Tours Enquiries",
                to: "all-group-tour-new",
                catId: 34,
            },
            {
                title: "All Customized Tours Enquiries",
                to: "all-customized-tour-new",
                catId: 35,
            },
            {
                title: "Operation Management Enquiries",
                to: "operator-custom-tours",
                catId: 60,
            },
            {
                title: "All Operation Management Enquiries",
                to: "all-operator-custom-tours",
                catId: 61,
            },
        ],
    },
    {
        title: "Confimed",
        classsChange: "mm-collapse",
        iconStyle: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                width="1.4rem"
                height="1.1rem"
            >
                <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
            </svg>
        ),
        catId: null,
        content: [
            {
                title: "Group Tours",
                to: "confirm-group-tour-new",
                catId: 4,
            },
            {
                title: "Customized Tours",
                to: "confirm-custom-tour-new",
                catId: 5,
            },
            {
                title: "All Group Tours",
                to: "all-confirm-group-tour-new",
                catId: 36,
            },
            {
                title: "All Customized Tours",
                to: "all-confirm-custom-tour-new",
                catId: 39,
            },
            {
                title: "Search Guests (Group Tour)",
                to: "search-group-tour-guests",
                catId: 54,
            },
            {
                title: "Search All Guests (Group Tour)",
                to: "search-group-tour-all-guests",
                catId: 52,
            },
            {
                title: "Search Guests (Custom Tour)",
                to: "search-custom-tour-guests",
                catId: 55,
            },
            {
                title: "Search All Guests (Custom Tour)",
                to: "search-custom-tour-all-guests",
                catId: 51,
            },
        ],
    },
    {
        title: "Booking records ",
        classsChange: "mm-collapse",
        iconStyle: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                width="1.4rem"
                height="1.1rem"
            >
                <path d="M64 256V160H224v96H64zm0 64H224v96H64V320zm224 96V320H448v96H288zM448 256H288V160H448v96zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64z" />
            </svg>
        ),
        catId: null,
        content: [
            {
                title: "Group Tours",
                to: "booking-group-tour-new",
                catId: 12,
            },
            {
                title: "Customized Tours",
                to: "booking-custom-tour-new",
                catId: 13,
            },
            {
                title: "All Group Tours",
                to: "all-booking-group-tour-new",
                catId: 37,
            },
            {
                title: "All Customized Tours",
                to: "all-booking-custom-tour-new",
                catId: 40,
            },
        ],
    },

    {
        title: "Presales Enquiry",
        classsChange: "mm-collapse",
        iconStyle: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 512 512"
            >
                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
            </svg>
        ),
        catId: null,
        content: [
            {
                title: "Group Tours",
                to: "presale-group-tour-new",
                catId: 48,
            },
            {
                title: "Customized Tours",
                to: "presale-customized-tour-new",
                catId: 49,
            },

        ],
    },

    {
        title: "Future Tour Enquiries",
        classsChange: "mm-collapse",
        iconStyle: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.4rem"
                height="1.1rem"
                viewBox="0 0 576 512"
            >
                <path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V428.7c-2.7 1.1-5.4 2-8.2 2.7l-60.1 15c-3 .7-6 1.2-9 1.4c-.9 .1-1.8 .2-2.7 .2H240c-6.1 0-11.6-3.4-14.3-8.8l-8.8-17.7c-1.7-3.4-5.1-5.5-8.8-5.5s-7.2 2.1-8.8 5.5l-8.8 17.7c-2.9 5.9-9.2 9.4-15.7 8.8s-12.1-5.1-13.9-11.3L144 381l-9.8 32.8c-6.1 20.3-24.8 34.2-46 34.2H80c-8.8 0-16-7.2-16-16s7.2-16 16-16h8.2c7.1 0 13.3-4.6 15.3-11.4l14.9-49.5c3.4-11.3 13.8-19.1 25.6-19.1s22.2 7.8 25.6 19.1l11.6 38.6c7.4-6.2 16.8-9.7 26.8-9.7c15.9 0 30.4 9 37.5 23.2l4.4 8.8h8.9c-3.1-8.8-3.7-18.4-1.4-27.8l15-60.1c2.8-11.3 8.6-21.5 16.8-29.7L384 203.6V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM549.8 139.7c-15.6-15.6-40.9-15.6-56.6 0l-29.4 29.4 71 71 29.4-29.4c15.6-15.6 15.6-40.9 0-56.6l-14.4-14.4zM311.9 321c-4.1 4.1-7 9.2-8.4 14.9l-15 60.1c-1.4 5.5 .2 11.2 4.2 15.2s9.7 5.6 15.2 4.2l60.1-15c5.6-1.4 10.8-4.3 14.9-8.4L512.1 262.7l-71-71L311.9 321z" />
            </svg>
        ),
        catId: null,
        content: [
            {
                title: "All Enquiries",
                to: "all-future-tour-enquiries",
                catId: 27,
            },
            {
                title: "My Enquiries",
                to: "my-future-tour-enquiries",
                catId: 33,
            },
        ],
    },
    {
        title: "Billing",
        classsChange: "mm-collapse",
        iconStyle: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1rem"
                height="1rem"
                viewBox="0 0 384 512"
            >
                <path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM80 64h64c8.8 0 16 7.2 16 16s-7.2 16-16 16H80c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64h64c8.8 0 16 7.2 16 16s-7.2 16-16 16H80c-8.8 0-16-7.2-16-16s7.2-16 16-16zm16 96H288c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V256c0-17.7 14.3-32 32-32zm0 32v64H288V256H96zM240 416h64c8.8 0 16 7.2 16 16s-7.2 16-16 16H240c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
            </svg>
        ),
        catId: null,
        content: [
            {
                title: "Group Tours",
                to: "billing-group-tour",
                catId: 6,
            },
            // {
            //     title: 'Edit Profile',
            //     to: 'edit-profile'
            // },
            {
                title: "Customized Tours",
                to: "billing-customized-tour",
                catId: 26,
            },
        ],
    },

    {
        title: "Lost enquiries",
        classsChange: "mm-collapse",
        iconStyle: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.4rem"
                height="1.1rem"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="lucide lucide-file-x"
                style={{ color: "#076fb0", height: "2rem" }}
            >
                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                <path d="m14.5 12.5-5 5" />
                <path d="m9.5 12.5 5 5" />
            </svg>
        ),
        catId: null,
        content: [
            {
                title: "Group Tours",
                to: "lost-grouptour",
                catId: 16,
            },
            {
                title: "Customized Tours",
                to: "lost-customizedtour",
                catId: 17,
            },
            {
                title: "All Group Tours",
                to: "all-lost-grouptour",
                catId: 38,
            },
            {
                title: "All Customized Tours",
                to: "all-lost-customizedtour",
                catId: 41,
            },
        ],
    },

    {
        title: "Git Operation",
        to: "git-operation-tours-list",
        classsChange: "mm-collapse",
        to: "git-operation-tours-list",
        iconStyle: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-blend"><circle cx="9" cy="9" r="7" /><circle cx="15" cy="15" r="7" /></svg>
        ),
        catId: 56,

    },
    {
        title: "Guests Information ",
        classsChange: "mm-collapse",
        iconStyle: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
                width="1.4rem"
                height="1.1rem"
            >
                <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm80 256h64c44.2 0 80 35.8 80 80c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16c0-44.2 35.8-80 80-80zm-32-96a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zm256-32H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
            </svg>
        ),
        catId: null,
        content: [
            {
                title: "Guest List",
                to: "guest-list",
                catId: 14,
            },
            {
                title: "All Guest Search",
                to: "all-guests-search",
                catId: 50,
            },
            {
                title: "All Guest List",
                to: "all-guest-list",
                catId: 46,
            },
        ],
    },
    {
        title: "Loyalty Program",
        classsChange: "mm-collapse",
        iconStyle: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.4rem"
                height="1.1rem"
                viewBox="0 0 640 512"
            >
                <path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM625 177L497 305c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L591 143c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
            </svg>
        ),
        catId: null,
        content: [
            {
                title: "Loyalty List",
                to: "loyalty",
                catId: 14,
            },
            {
                title: "All Loyalty List",
                to: "all-loyalty",
                catId: 47,
            },
        ],
    },

    {
        title: "Reports",
        classsChange: "mm-collapse",
        iconStyle: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                width="1.2rem"
                height="1.2rem"
            >
                <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM64 256c0-17.7 14.3-32 32-32H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H96c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
            </svg>
        ),
        catId: null,
        content: [
            {
                title: "Commision Reports",
                to: "view-commision-reports",
                catId: 9,
            },
            {
                title: "Waari Select",
                to: "waari-select",
                catId: 29,
            },
            // {
            // 	title: "Monthwise Profit",
            // 	to: "monthwise-profit",
            // 	catId: 29,
            // },
            // {
            // 	title: "Customize Tour Profit(Month Wise)",
            // 	to: "customized-monthwise-profit",
            // 	catId: 28,
            // },
            // {
            // 	title: "GroupTour Profit",
            // 	to: "grouptour-profit",
            // 	catId: 29,
            // },
            // {
            // 	title: "Customized Guest Travel",
            // 	to: "customized-guest-travel",
            // 	catId: 29,
            // },
            // {
            // 	title: "Group Guest Travel",
            // 	to: "group-guest-travel",
            // 	catId: 29,
            // },
            // {
            // 	title: "Customized Travel Cities",
            // 	to: "customized-travel-cities",
            // 	catId: 29,
            // },
            // {
            // 	title: "Group Travel Cities",
            // 	to: "group-travel-cities",
            // 	catId: 29,
            // },
            // {
            // 	title: "Coupon",
            // 	to: "coupon-report",
            // 	catId: 29,
            // },

            // {
            // 	title: "Market",
            // 	to: "market",
            // 	catId: 29,
            // },
        ],
    },
    {
        title: "Affiliator-Influencers",
        to: "affiliator-influencers",
        iconStyle: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.2rem"
                height="1.2rem"
                viewBox="0 0 384 512"
            >
                <path d="M192 0c-41.8 0-77.4 26.7-90.5 64H64C28.7 64 0 92.7 0 128V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H282.5C269.4 26.7 233.8 0 192 0zm0 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM72 272a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zm104-16H304c8.8 0 16 7.2 16 16s-7.2 16-16 16H176c-8.8 0-16-7.2-16-16s7.2-16 16-16zM72 368a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zm88 0c0-8.8 7.2-16 16-16H304c8.8 0 16 7.2 16 16s-7.2 16-16 16H176c-8.8 0-16-7.2-16-16z" />
            </svg>
        ),
        catId: 31,
    },
    // {
    //     title: 'Affiliates Coupon',
    //     to:"coupon",
    //     iconStyle: <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM112 256H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16z"/></svg>,

    // },
    {
        title: "User Management",
        classsChange: "mm-collapse",
        iconStyle: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                width="1.4rem"
                height="1.1rem"
            >
                <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
            </svg>
        ),
        catId: null,
        content: [
            {
                title: "Users",
                to: "users-list",
                catId: 25,
            },
        ],
    },
    {
        title: "Roles and Permissions",
        to: "role-list",
        catId: 24,
        iconStyle: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.2rem"
                height="1.2rem"
                viewBox="0 0 448 512"
            >
                <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm64 96a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM96 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM224 224a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm64-64a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32 160a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
            </svg>
        ),
    },
    {
        title: "Sales Target",
        to: "sales-target",
        iconStyle: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.2rem"
                height="1.2rem"
                viewBox="0 0 512 512"
            >
                {" "}
                <path d="M192 96H320l47.4-71.1C374.5 14.2 366.9 0 354.1 0H157.9c-12.8 0-20.4 14.2-13.3 24.9L192 96zm128 32H192c-3.8 2.5-8.1 5.3-13 8.4l0 0 0 0C122.3 172.7 0 250.9 0 416c0 53 43 96 96 96H416c53 0 96-43 96-96c0-165.1-122.3-243.3-179-279.6c-4.8-3.1-9.2-5.9-13-8.4zM289.9 336l47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47z" />
            </svg>
        ),
        catId: 21,
    },
    {
        title: "Globe Information",
        to: "globe-information",
        iconStyle: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.2rem"
                height="1.2rem"
                viewBox="0 0 448 512"
            >
                <path d="M0 96C0 43 43 0 96 0H384h32c17.7 0 32 14.3 32 32V352c0 17.7-14.3 32-32 32v64c17.7 0 32 14.3 32 32s-14.3 32-32 32H384 96c-53 0-96-43-96-96V96zM64 416c0 17.7 14.3 32 32 32H352V384H96c-17.7 0-32 14.3-32 32zM247.4 283.8c-3.7 3.7-6.2 4.2-7.4 4.2s-3.7-.5-7.4-4.2c-3.8-3.7-8-10-11.8-18.9c-6.2-14.5-10.8-34.3-12.2-56.9h63c-1.5 22.6-6 42.4-12.2 56.9c-3.8 8.9-8 15.2-11.8 18.9zm42.7-9.9c7.3-18.3 12-41.1 13.4-65.9h31.1c-4.7 27.9-21.4 51.7-44.5 65.9zm0-163.8c23.2 14.2 39.9 38 44.5 65.9H303.5c-1.4-24.7-6.1-47.5-13.4-65.9zM368 192a128 128 0 1 0 -256 0 128 128 0 1 0 256 0zM145.3 208h31.1c1.4 24.7 6.1 47.5 13.4 65.9c-23.2-14.2-39.9-38-44.5-65.9zm31.1-32H145.3c4.7-27.9 21.4-51.7 44.5-65.9c-7.3 18.3-12 41.1-13.4 65.9zm56.1-75.8c3.7-3.7 6.2-4.2 7.4-4.2s3.7 .5 7.4 4.2c3.8 3.7 8 10 11.8 18.9c6.2 14.5 10.8 34.3 12.2 56.9h-63c1.5-22.6 6-42.4 12.2-56.9c3.8-8.9 8-15.2 11.8-18.9z" />
            </svg>
        ),
        catId: 7,
    },

    {
        title: "Coupon Management",
        classsChange: "mm-collapse",
        iconStyle: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
                width="1.2rem"
                height="1.2rem"
            >
                <path d="M64 64C28.7 64 0 92.7 0 128v64c0 8.8 7.4 15.7 15.7 18.6C34.5 217.1 48 235 48 256s-13.5 38.9-32.3 45.4C7.4 304.3 0 311.2 0 320v64c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V320c0-8.8-7.4-15.7-15.7-18.6C541.5 294.9 528 277 528 256s13.5-38.9 32.3-45.4c8.3-2.9 15.7-9.8 15.7-18.6V128c0-35.3-28.7-64-64-64H64zm64 112l0 160c0 8.8 7.2 16 16 16H432c8.8 0 16-7.2 16-16V176c0-8.8-7.2-16-16-16H144c-8.8 0-16 7.2-16 16zM96 160c0-17.7 14.3-32 32-32H448c17.7 0 32 14.3 32 32V352c0 17.7-14.3 32-32 32H128c-17.7 0-32-14.3-32-32V160z" />
            </svg>
        ),
        to: "coupon-list",
        catId: 10,
    },
    {
        title: "Team Management",
        classsChange: "mm-collapse",
        iconStyle: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-microsoft-teams"
                viewBox="0 0 16 16"
            >
                <path d="M9.186 4.797a2.42 2.42 0 1 0-2.86-2.448h1.178c.929 0 1.682.753 1.682 1.682zm-4.295 7.738h2.613c.929 0 1.682-.753 1.682-1.682V5.58h2.783a.7.7 0 0 1 .682.716v4.294a4.197 4.197 0 0 1-4.093 4.293c-1.618-.04-3-.99-3.667-2.35Zm10.737-9.372a1.674 1.674 0 1 1-3.349 0 1.674 1.674 0 0 1 3.349 0m-2.238 9.488-.12-.002a5.2 5.2 0 0 0 .381-2.07V6.306a1.7 1.7 0 0 0-.15-.725h1.792c.39 0 .707.317.707.707v3.765a2.6 2.6 0 0 1-2.598 2.598z" />
                <path d="M.682 3.349h6.822c.377 0 .682.305.682.682v6.822a.68.68 0 0 1-.682.682H.682A.68.68 0 0 1 0 10.853V4.03c0-.377.305-.682.682-.682Zm5.206 2.596v-.72h-3.59v.72h1.357V9.66h.87V5.945z" />
            </svg>
        ),
        to: "teams-list",
        catId: 43,
    },

    {
        title: "Under Team Lead Sales Listing",
        classsChange: "mm-collapse",
        iconStyle: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 512"
                width="1.2rem"
                height="1.2rem"
            >
                <path d="M72 88a56 56 0 1 1 112 0A56 56 0 1 1 72 88zM64 245.7C54 256.9 48 271.8 48 288s6 31.1 16 42.3V245.7zm144.4-49.3C178.7 222.7 160 261.2 160 304c0 34.3 12 65.8 32 90.5V416c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V389.2C26.2 371.2 0 332.7 0 288c0-61.9 50.1-112 112-112h32c24 0 46.2 7.5 64.4 20.3zM448 416V394.5c20-24.7 32-56.2 32-90.5c0-42.8-18.7-81.3-48.4-107.7C449.8 183.5 472 176 496 176h32c61.9 0 112 50.1 112 112c0 44.7-26.2 83.2-64 101.2V416c0 17.7-14.3 32-32 32H480c-17.7 0-32-14.3-32-32zm8-328a56 56 0 1 1 112 0A56 56 0 1 1 456 88zM576 245.7v84.7c10-11.3 16-26.1 16-42.3s-6-31.1-16-42.3zM320 32a64 64 0 1 1 0 128 64 64 0 1 1 0-128zM240 304c0 16.2 6 31 16 42.3V261.7c-10 11.3-16 26.1-16 42.3zm144-42.3v84.7c10-11.3 16-26.1 16-42.3s-6-31.1-16-42.3zM448 304c0 44.7-26.2 83.2-64 101.2V448c0 17.7-14.3 32-32 32H288c-17.7 0-32-14.3-32-32V405.2c-37.8-18-64-56.5-64-101.2c0-61.9 50.1-112 112-112h32c61.9 0 112 50.1 112 112z" />
            </svg>
        ),
        to: "under-team-lead-sales-list",
        catId: 42,
    },
    // {
    // 	title: 'Billing',
    // 	classsChange: 'mm-collapse',
    // 	iconStyle: <svg xmlns="http://www.w3.org/2000/svg" width="1.2rem" height="1.2rem" viewBox="0 0 384 512"><path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM80 64h64c8.8 0 16 7.2 16 16s-7.2 16-16 16H80c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64h64c8.8 0 16 7.2 16 16s-7.2 16-16 16H80c-8.8 0-16-7.2-16-16s7.2-16 16-16zm16 96H288c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V256c0-17.7 14.3-32 32-32zm0 32v64H288V256H96zM240 416h64c8.8 0 16 7.2 16 16s-7.2 16-16 16H240c-8.8 0-16-7.2-16-16s7.2-16 16-16z"/></svg>,
    // 	catId: null,
    // 	content: [
    // 		{
    // 			title: 'Group Tours',
    // 			to: 'billing-group-tour',
    // 			catId: 6,
    // 		},
    // 		// {
    // 		//     title: 'Edit Profile',
    // 		//     to: 'edit-profile'
    // 		// },
    // 		{
    // 			title: 'Customized Tours',
    // 			to: "billing-customized-tour",
    // 			catId: 26,

    // 		},

    // 	],
    // },


    {
        title: "Feedback List",
        to: "feedback-list",
        catId: 32,
        iconStyle: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.2rem"
                height="1.2rem"
                viewBox="0 0 512 512"
            >
                <path d="M64 0C28.7 0 0 28.7 0 64V352c0 35.3 28.7 64 64 64h96v80c0 6.1 3.4 11.6 8.8 14.3s11.9 2.1 16.8-1.5L309.3 416H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64z" />
            </svg>
        ),
    },

    {
        title: "Website Management",
        classsChange: "mm-collapse",
        iconStyle: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                width="1.4rem"
                height="1.1rem"
            >
                <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
            </svg>
        ),
        catId: null,
        content: [
            {
                title: "Contacts",
                to: "website-enquiries",
                catId: 53,
            },
            {
                title: "Home Page Tours",
                to: "website-homepage-tours-manage",
                catId: 53,
            },
            {
                title: "Home Page Five Sections",
                to: "home-five-sections-list",
                catId: 53,
            },
            {
                title: "Tour Types (Experiences)",
                to: "tour-type-list",
                catId: 53,
            },
            {
                title: "Reviews List",
                to: "reviews-list",
                catId: 53,
            },
            {
                title: "Sales Offices",
                to: "sales-offices-list",
                catId: 53,
            },
        ],
    },

    // {
    // 	title: "Enquiry Follow-up (old)",
    // 	classsChange: "mm-collapse",
    // 	iconStyle: (
    // 		<svg
    // 			xmlns="http://www.w3.org/2000/svg"
    // 			height="1em"
    // 			viewBox="0 0 512 512"
    // 		>
    // 			<path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
    // 		</svg>
    // 	),
    // 	catId: null,
    // 	content: [
    // 		{
    // 			title: "Group Tours",
    // 			to: "group-tour",
    // 			catId: 2,
    // 		},
    // 		{
    // 			title: "Customized Tours",
    // 			to: "customized-tour",
    // 			catId: 3,
    // 		},
    // 	],
    // },
    // {
    // 	title: "Confimed  (old)",
    // 	classsChange: "mm-collapse",
    // 	iconStyle: (
    // 		<svg
    // 			xmlns="http://www.w3.org/2000/svg"
    // 			height="1em"
    // 			viewBox="0 0 448 512"
    // 		>
    // 			<path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
    // 		</svg>
    // 	),
    // 	catId: null,
    // 	content: [
    // 		{
    // 			title: "Group Tours",
    // 			to: "confirm-group-tour",
    // 			catId: 4,
    // 		},
    // 		{
    // 			title: "Customized Tours",
    // 			to: "confirm-customized-tour",
    // 			catId: 5,
    // 		},
    // 	],
    // },
    // {
    // 	title: "Booking records (Old)",
    // 	iconStyle: (
    // 		<svg
    // 			xmlns="http://www.w3.org/2000/svg"
    // 			height="1em"
    // 			viewBox="0 0 512 512"
    // 		>
    // 			<path d="M64 256V160H224v96H64zm0 64H224v96H64V320zm224 96V320H448v96H288zM448 256H288V160H448v96zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64z" />
    // 		</svg>
    // 	),
    // 	catId: null,
    // 	content: [
    // 		{
    // 			title: "Group Tours",
    // 			to: "booking-record-grouptour",
    // 			catId: 12,
    // 		},
    // 		{
    // 			title: "Customized Tours",
    // 			to: "booking-record-customizetour",
    // 			catId: 13,
    // 		},
    // 	],
    // },
];
