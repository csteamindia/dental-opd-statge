
import moment from "moment";

const Timezone = (dateString) => {    
    const date = moment(dateString).toDate();
    return moment(date).format('YYYY-MM-DD');;
}

export default Timezone;