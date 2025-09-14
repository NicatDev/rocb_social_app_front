import Axios from "@/config/Axios/index.jsx"



const Index = {
    login: (data) => Axios.post('account/login/', data).then(res => res),

    get: (data) => Axios.get('users', { params: data }).then(res => res),
    create: (data) => Axios.post('users', data).then(res => res),
    update: (data) => Axios.put('users', data).then(res => res),
    getFilterbaleColumnsData: () => Axios.get('users/getFilterableDatas').then(res => res),
    getDropdownList: () => Axios.get('users/GetDropdownList').then(res => res),
    getSingleUpdate: (data) => Axios.get('users/getSingle', { params: data }).then(res => res),
}

export default Index;

