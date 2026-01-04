import { ArrowForwardIos } from "@mui/icons-material";


export const NextArrow = (props: any) => {
    const { onClick } = props;
    return (
        <ArrowForwardIos
            onClick={onClick}
            sx={{
                position: "absolute",
                top: "50%",
                right: 10,
                zIndex: 2,
                cursor: "pointer",
                color: "#fff",
                backgroundColor: "rgba(0,0,0,0.5)",
                borderRadius: "50%",
                padding: "4px",
                transform: "translateY(-50%)"
            }}
        />
    );
};