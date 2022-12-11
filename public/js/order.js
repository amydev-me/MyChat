Vue.use(VeeValidate);
var myObject = new Vue({
    el: '#cart',
    data: {
        orders : [],
        selected_status : 'Processing',
        employee : {
            _id : null,
            name : null,
            password : null,
            email : null,
            position : null,
            phone :null 
        },
        isEdit : false
    },
    methods:{          
        formatDate(val){
            return moment(val).format('DD/MM/YYYY');
        }, 
        getOrders(status){
            
            axios.get('/api/admin/get-employees').then(({data}) => {
                this.orders = data.items;
            }).catch(error => {

            })
        }, 
        clearForm(){
            this.employee._id = null;
            this.employee.name = null;
            this.employee.position = null;
            this.employee.password = null;
            this.employee.email = null;
            this.employee.phone = null;
        },
        onClickedDialog(){
            this.clearForm();
            this.isEdit = false;
            $('#exampleModalCenter').modal('show');
        },
        onClickedEditDialog(tr){
            this.clearForm();
            this.employee = tr;
            this.isEdit = true;
            $('#exampleModalCenter').modal('show');
        },
        onClickedSave(){
            if(this.isEdit){
                axios.post(`/api/edit-employee`, this.employee).then(({data}) => {
                    this.orders = data.items; 
                    this.isEdit = false;
                    this.clearForm();
                    $('#exampleModalCenter').modal('hide');
                }).catch(error => {
                    
                })
            }else{
                axios.post(`/api/create-employee`, this.employee).then(({data}) => {
                    this.orders = data.items;
                    this.clearForm();
                    $('#exampleModalCenter').modal('hide');
                }).catch(error => {
                    
                })
            } 
        }
    },
    mounted(){
        this.getOrders('Pending');
    }
}) 