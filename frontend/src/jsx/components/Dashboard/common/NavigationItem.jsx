const NavigationItem = ({ completionStatus, stepNumber, stepName }) => {
    const stepCompleted = completionStatus >= stepNumber;

    return (
        <div
            className={`mb-2 col-xl-2 col-lg-2 col-md-4 col-xs-6 col-sm-6 col-12 nav-item cursor-pointer`}
        >
            <div
                className={`border p-2 fw-bold text-center nav-link ${
                    stepCompleted ? "active d-flex justify-content-center" : ""
                }`}
            >
                {stepCompleted ? (
                    <span className="role-icon">
                        <svg
                            width="1rem"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                            style={{ padding: "1px 2px" }}
                        >
                            <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                        </svg>
                    </span>
                ) : null}
                <p style={{ whiteSpace: "nowrap" }}>{stepName}</p>
            </div>
        </div>
    );
};

export default NavigationItem;