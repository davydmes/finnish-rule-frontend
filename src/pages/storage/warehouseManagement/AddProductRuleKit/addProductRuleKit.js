import React, { Component } from 'react';
import './addProductRuleKit.css';
import { fetchApi } from '../../../../services/api';

class addProductRuleKit extends Component {

  constructor(props) {
    super(props)


    this.state = {
      "harr": [],
      "groupId": "",

      "productCode": "",
      "name": "",
      "additionalInformation": "",
      "shelfLocation": "",
      "sellingPrice": 0,
      "vat": 23,
      "purchasePrice": "",
      "unit": "",
      "size": "",
      "thickness": "",
      "picture": "",
      "pictureFile":"",
      // "inStore": "",
      // "busy": "",
      "sel":"0",
      "taxFree":"NAN",
      "taxInclude":"NAN",
      "priceType":"tax-free"







    }

    // this.createProduct();
  }



  componentDidMount() {
    if (this.props.location && this.props.location.query) {
      console.log(this.props.location.query);
      var harr = this.props.location.query;
      this.setState({
        harr: harr
      })
    }
    else{
      this.props.history.push("/storage/warehousemanagement");
    }
  }

  selectBox = (event) => {
    var key = "";
    if(event.target.value==="0"){
      key = "tax-free"
    }
    else{
      key = "tax-include"
    }
    this.setState({
      sel:event.target.value,
      priceType:key
    },()=>{
      this.calculate();
    });
   
  }

  setSelling = (e) =>{
    this.setState({ "sellingPrice": e.target.value },()=>{
      this.calculate();
    });
  }

  setVat=(e)=>{
    this.setState({ "vat": e.target.value },()=>{
      this.calculate();
    });
  }

  calculate=()=>{
    var vat = parseFloat(this.state.vat) || 0;
    var sp =parseFloat(this.state.sellingPrice) || 0;
    if(this.state.sel==="0"){
    
      this.setState({
        "taxFree":sp,
        "taxInclude":((vat/100)*sp) + sp
      })
    }
    else{
      this.setState({
        "taxFree": sp - ((vat/100)*sp),
        "taxInclude":this.state.sellingPrice
      })
    }
  }

  getImage=(e)=>{

    this.setState({
      picture:e.target.value,
      pictureFile:e.target.files[0]
    });
  }

  createProduct = () => {
    console.log(this.state);
    let header = {
      "Authorization": "token " + JSON.parse(localStorage.getItem("userData")).sessionId, "Content-Type": 'multipart/form-data'
    }

    var bodyFormData = new FormData();

    if(this.state.pictureFile) bodyFormData.append('picture', this.state.pictureFile);
    if(this.state.harr._id) bodyFormData.set('group', this.state.harr._id);
    if(this.state.productCode) bodyFormData.set('productCode', this.state.productCode);
    if(this.state.name) bodyFormData.set('name', this.state.name);
    if(this.state.additionalInformation) bodyFormData.set('additionalInformation', this.state.additionalInformation);
    if(this.state.unit) bodyFormData.set('unit', this.state.unit);
    if(this.state.sellingPrice) bodyFormData.set('sellingPrice', this.state.sellingPrice);
    if(this.state.vat) bodyFormData.set('vat', this.state.vat);
    if(this.state.purchasePrice) bodyFormData.set('purchasePrice', this.state.purchasePrice);
    if(this.state.shelfLocation) bodyFormData.set('shelfLocation', this.state.shelfLocation);
    if(this.state.size) bodyFormData.set('size', this.state.size);
    if(this.state.thickness) bodyFormData.set('thickness', this.state.thickness);
    if(this.state.priceType) bodyFormData.set('priceType', this.state.priceType);
 
    fetchApi("/products/createProduct", "POST", bodyFormData, header)
      .then(response => {
        console.log("====>", response);
        if(response.data.success){
          this.props.history.push("/storage/warehousemanagement");
        }
      }, err => {
        console.log(err);
        alert("tapahtui virhe!");
      })
  }

  cancel=()=>{
    this.props.history.push("/storage/warehousemanagement");
  }


  render() {
    return (


      <div className="popup" className="padding-30">

        <input name="id" type="hidden" defaultValue={10} />
        <table style={{ border: '1px solid black', marginLeft: 'auto', marginRight: 'auto', background: 'white' }} align="center">
          <tbody><tr bgcolor="#525252" height="25px">
            <td className="blue" colSpan={3}><div align="center" className="valkonenteksti"><strong><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>Add a new product</font></font></strong></div></td>
          </tr>

            <tr>
              <td className="hd"><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>product code</font></font></td>
              <td><input type="text" name="tuotekoodi" size={25} value={this.state.productCode} onChange={(e) => { this.setState({ "productCode": e.target.value }) }} /></td>
            </tr>

            <tr>
              <td className="hd"><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>Name</font></font></td>
              <td><input type="text" name="nimi" size={25} value={this.state.name} onChange={(e) => { this.setState({ "name": e.target.value }) }} /></td>
            </tr>

            <tr>
              <td className="hd"><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>Additional Information</font></font></td>
              <td><textarea name="lisatiedot" cols={30} rows={3} value={this.state.additionalInformation} onChange={(e) => { this.setState({ "additionalInformation": e.target.value }) }} /></td>
            </tr>

            <tr>
              <td className="hd"><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>shelf Location</font></font></td>
              <td><input type="text" name="hyllypaikka" size={10} value={this.state.shelfLocation} onChange={(e) => { this.setState({ "shelfLocation": e.target.value }) }} /></td>
            </tr>

            <tr>
              <td className="hd"><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>Selling price</font></font></td>
              <td>
                <select name="hintatyyppi" id="hintatyyppi" value={this.state.sel} onChange={this.selectBox} >
                  <option value="0">tax free price</option>
                  <option value="1">Price including tax</option>
                </select>
                <input type="text" size={8} id="nykyhinta" value={this.state.sellingPrice} onChange={(e) => this.setSelling(e) } />
              </td>
              <td style={{ textAlign: 'right' }}>
                <small><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>tax free price</font></font></small> <input type="text" readOnly size={6} id="veroton" name="myyntihinta" value={this.state.taxFree} defaultValue style={{ backgroundColor: '#DADADA' }} /><br />
                <small><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>Price including tax</font></font></small> <input type="text" readOnly size={6} id="verollinen" value={this.state.taxInclude} defaultValue style={{ backgroundColor: '#DADADA' }} />
              </td>
            </tr>

            <tr>
              <td className="hd"><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>VAT</font></font></td>
              <td colSpan={2}>
                <input type="text" name="alv" id="alv" size={3} value={this.state.vat} onChange={(e) => this.setVat(e) } /></td>
            </tr>



            <tr>
              <td className="hd"><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>Purchase price</font></font></td>
              <td colSpan={2}><input type="text" name="hankintahinta" size={10} value={this.state.purchasePrice} onChange={(e) => { this.setState({ "purchasePrice": e.target.value }) }} /></td>
            </tr>

            <tr>
              <td className="hd"><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>Unit</font></font></td>
              <td colSpan={2}><input type="text" name="yksikko" size={10} value={this.state.unit} onChange={(e) => { this.setState({ "unit": e.target.value }) }} /></td>
            </tr>




            <tr>
              <td className="hd"><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>Paper size</font></font></td>
              <td colSpan={2}><input type="text" name="koko" size={10} value={this.state.size} onChange={(e) => { this.setState({ "size": e.target.value }) }} /></td>
            </tr>



            <tr>
              <td className="hd"><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>Paper thickness</font></font></td>
              <td colSpan={2}><input type="text" name="paksuus" size={10} value={this.state.thickness} onChange={(e) => { this.setState({ "thickness": e.target.value }) }} /></td>
            </tr>




            <tr>
              <td className="hd"><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}>Picture</font></font></td>
              <td colSpan={2}><input type="file" accept=".jpg, .png" name="image_file" value={this.state.picture} onChange={(e) => { this.getImage(e) }} /></td>
            </tr>
          </tbody></table>
        <table align="center" style={{ border: '0px solid black', marginLeft: 'auto', marginRight: 'auto', marginTop: '10px' }}>
          <tbody><tr>
            <td><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}><input type="submit" onClick={this.createProduct} name="submit_uusi" id="submit_uusi" defaultValue="More" /></font></font></td>
            <td><font style={{ verticalAlign: 'inherit' }}><font style={{ verticalAlign: 'inherit' }}><input type="button" onClick={this.cancel} defaultValue="Bracket" /></font></font></td>
          </tr>
          </tbody></table>
      </div>

    );
  }
}

export default addProductRuleKit;