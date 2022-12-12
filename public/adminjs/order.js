
Vue.use(VeeValidate);
var myObject = new Vue({
    el: '#cart',
    data: {
        orders : [],
        selected_status : 'Processing'
    },
    methods:{          
        formatDate(val){
            return moment(val).format('DD/MM/YYYY');
        }, 
        getOrders(status){
            status = status == 'Processing'?'Pending' : status;
            axios.get('/api/get-orders',{
                params : {
                    status
                }
            }).then(({data}) => {
                this.orders = data;
            }).catch(error => {

            })
        },
        onSelectedChange(){
            this.getOrders(this.selected_status)
        },
        changeStatus(order, status){
            
            let confirm =window.confirm('Are you sure want to change status?')
            if(confirm){
                axios.post('/api/change-status', {
                    _id : order._id,
                    status : status
                }).then(({data}) => {
                    this.orders = data.orders;
                }).catch(error => {
                    this.message = error.response.data.message;
                })
            }
         
        }
    },
    mounted(){
        this.getOrders('Pending');
    }
})