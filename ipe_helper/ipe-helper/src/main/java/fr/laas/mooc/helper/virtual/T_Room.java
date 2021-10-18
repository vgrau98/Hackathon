package fr.laas.mooc.helper.virtual;

public enum T_Room {
	BEDROOM("http://w3id.org/laas-iot/mooc#Bedroom"), BATHROOM("http://w3id.org/laas-iot/mooc#Bathroom"), LIVINGROOM("http://w3id.org/laas-iot/mooc#Bedroom"), GARDEN("http://w3id.org/laas-iot/mooc#Garden");
	
	private String uri;
	
	private T_Room(String uri){
		this.uri = uri;
	}
	
	public String getUri(){
		return this.uri;
	}
	
}
