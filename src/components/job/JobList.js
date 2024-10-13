
import Card from "../reusable/Card";
import { useDispatch, useSelector } from "react-redux";
import { fetchJob } from "../../features/slices/jobSlice";
import { useEffect } from "react";
import ListContainer from "../reusable/ListContainer";
import { setCurrentPage, selectCurrentPage, selectItemsPerPage, selectTotalItems } from '../../features/slices/paginationSlice';
import PaginationComponent from "../reusable/Pagination";
import { addFavorite,getFavorite } from "../../features/slices/favoriteSlice";


const JobList = ({ jobs }) => {
    const dispatch = useDispatch();
    const { isClicked } = useSelector((state) => state.favorites);
    useEffect(() => {
        dispatch(getFavorite("job"))
    }, []);
    
    return (
    <>
    {jobs.map(job => {
        return(
            <Card
                key={job.id}
                id={job.id}
                image={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRB6qQYTiaG58zHg3LwPcbPaqOrkFmAschW8A&s'}
                imageAlt={job.job_rquire}
                title={job.position}
                description={job.job_desc}
                // facebookLink={job.updatedAt}
                // instagramLink={job.updatedAt}
                // twitterLink={job.createdAt}
                // youtubeLink={job.createdAt}
                // websiteLink={job.createdAt}
                location={job.location}
                deadLine={job.deadline}
                timeOut={job.salary}
                type={"job"}
                isHeartClicked = {isClicked[job.id]}
                route={`/job-detail/${ job.id }`}
            />)
        
    })}
    </>
);
};

export default JobList;