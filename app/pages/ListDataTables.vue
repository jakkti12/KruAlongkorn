<template>
    <v-data-table
      :headers="headers"
      :items="desserts"
      :search="search"
      :sort-by="[{ key: 'calories', order: 'asc' }]"
    >
      <template v-slot:top>
        <v-toolbar
          flat
        >
          <v-toolbar-title>รายชื่อสมาชิก</v-toolbar-title>
          <!--หน้าค้นหา-->
          <v-text-field
          v-model="search"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line
          ></v-text-field>
          
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <v-spacer></v-spacer>
          <v-dialog
            v-model="dialog"
            max-width="500px"
          >
            <template v-slot:activator="{ props }">
              <v-btn
                class="mb-2"
                color="primary"
                dark
                v-bind="props"
              >
                เพิ่มข้อมูล
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>
  
              <v-card-text>
                <v-container>
                  <v-row>
                    <!--ทำให้ไม่สามารถกรอก id ได้-->
                    <v-col
                      cols="12"
                      md="4"
                      sm="6"
                    >
                      <v-text-field
                        v-model="editedItem.id"
                        label="Id"
                        disabled
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      md="4"
                      sm="6"
                    >
                      <v-text-field
                        v-model="editedItem.username"
                        label="Username"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      md="4"
                      sm="6"
                    >
                      <v-text-field
                        v-model="editedItem.password"
                        label="password"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      md="4"
                      sm="6"
                    >
                      <v-text-field
                        v-model="editedItem.status"
                        label="Status"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      md="4"
                      sm="6"
                    >
                      <v-text-field
                        v-model="editedItem.email"
                        label="Email"
                      ></v-text-field>
                    </v-col>

                    <v-col
                      cols="12"
                      md="4"
                      sm="6"
                    >
                      <v-text-field
                        v-model="editedItem.picture"
                        label="Picture"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
  
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue-darken-1"
                  variant="text"
                  @click="close"
                >
                  Cancel
                </v-btn>
                <v-btn
                  color="blue-darken-1"
                  variant="text"
                  @click="save"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">คุณต้องการลบข้อมูลนี้ใช่หรือไม่?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          class="me-2"
          size="small"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          size="small"
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn
          color="primary"
          @click="initialize"
        >
          Reset
        </v-btn>
      </template>
    </v-data-table>
  </template>
  <script>
  import axios from 'axios'
  export default {
    data: () => ({
      dialog: false,
      dialogDelete: false,
      search: '',
      headers: [
        {
          title: 'ID',
          align: 'start',
          sortable: false,
          key: 'id',
        },
        { title: 'Username', key: 'username' },
        { title: 'Password', key: 'password' },
        { title: 'Email', key: 'email' },
        { title: 'Status', key: 'status' },
        { title: 'Picture', key: 'picture' },
        { title: 'Edit/Delete', key: 'actions', sortable: false },
      ],
        desserts: [
        ],
      editedIndex: -1,
      editedItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      },
      defaultItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'เพิ่มข้อมูล' : 'แก้ไขข้อมูล'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    async created () {
      this.initialize()
      const response = await axios.get('http://localhost:7000/liststds');
      const data = response.data
      this.desserts = data.student;
      console.log(data);
    },

    methods: {
      initialize () { },

      editItem (item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
        // const response = await axios.get('http://localhost:7000/update?id='+item.id);
        // const data = response.data
        // this.desserts = data.student;
        // console.log(data);
      },

      deleteItem (item) {
        this.ids = item
        console.log('item =>',item.id)
        this.dialogDelete = true
      },

      async deleteItemConfirm () {
        const response = await axios.post('http://localhost:7000/delete?id='+this.ids.id);
        const data = response.data
        console.log('Id =>',this.ids)
        // ทำให้โหลดข้อมูลใหม่
        this.initialize()
        this.closeDelete()
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save () {
        if (this.editedIndex === -1) {
          const response = axios.post('http://localhost:7000/insert',this.editedItem)
          const data = response.editedItem
          console.log('data =>',data)
          if (this.editedIndex > -1) {
            Object.assign(this.desserts[this.editedIndex], this.editedItem)
          } else {
            this.desserts.push(this.editedItem)
          }
          this.close()
        }else {
          const response = axios.post('http://localhost:7000/update',this.editedItem)
          const data = response.editedItem
          console.log('data =>',data)
          if (this.editedIndex > -1) {
          Object.assign(this.desserts[this.editedIndex], this.editedItem)
          } else {
            this.desserts.push(this.editedItem)
          }
          this.close()
      }},
    },
  }
</script>