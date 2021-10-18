package fr.laas.om2m.ipe;

import org.eclipse.om2m.commons.resource.AE;
import org.eclipse.om2m.commons.resource.Container;
import org.eclipse.om2m.commons.resource.ContentInstance;
import org.eclipse.om2m.commons.resource.SemanticDescriptor;

import fr.laas.mooc.helper.http.HTTPPost;
import fr.laas.mooc.helper.om2m.ResourceCreator;
import fr.laas.mooc.helper.om2m.Serializer;
import fr.laas.mooc.helper.virtual.Platform;
import fr.laas.mooc.helper.virtual.SensorManager;
import fr.laas.mooc.helper.virtual.T_Room;
import fr.laas.mooc.helper.virtual.VirtualSensor;

public class IPE implements IVirtualSensor {


	private SensorManager sm;

	//To change regarding gateway IP
	private String IP_MN = "http://localhost:8080/~/mn-cse";

	@Override
	public SensorManager createSensorManager(String name) {
		HTTPPost request = new HTTPPost();
		request.setDestinator(IP_MN);
		request.addHeader("X-M2M-Origin", "admin:admin");
		request.addHeader("Content-Type", "application/xml;ty=2");
		AE ae = ResourceCreator.createAE(name, "VirtualSensor");
		request.setBody(Serializer.toXML(ae));
		request.send();
		this.sm = new SensorManager(name);
		return sm;
	}

	@Override
	public void createPlatform(String sm, Platform platform) {
		HTTPPost request = new HTTPPost();
		request.setDestinator(IP_MN+sm);
		request.addHeader("X-M2M-Origin", "admin:admin");
		request.addHeader("Content-Type", "application/xml;ty=3");
		Container cnt = ResourceCreator.createContainer(platform.getName());
		cnt.getLabels().add("Platform");
		request.setBody(Serializer.toXML(cnt));
		request.send();
		if(this.sm.getId().equals(sm)){
			this.sm.addPlatform(platform);
		}
	}

	@Override
	public void addSensor(String sm, String platform, VirtualSensor sensor) {
		if(this.sm.getId().equals(sm)){
			this.sm.addSensor(platform, sensor);
		}
		HTTPPost request = new HTTPPost();
		request.setDestinator(IP_MN+sm+"/"+platform);
		request.addHeader("X-M2M-Origin", "admin:admin");
		request.addHeader("Content-Type", "application/xml;ty=3");
		Container cnt = ResourceCreator.createContainer(sensor.getId());
		request.setBody(Serializer.toXML(cnt));
		request.send();
		request = new HTTPPost();
		request.setDestinator(IP_MN+"/in-name/"+sm+"/"+platform+"/"+sensor.getId());
		request.addHeader("X-M2M-Origin", "admin:admin");
		request.addHeader("Content-Type", "application/xml;ty=24");
		SemanticDescriptor smd = ResourceCreator.createSemanticDescriptor(sensor.getId()+"_DESC", sensor.getSensorDescriptor());
		request.setBody(Serializer.toXML(smd));
		request.send();
	}

	@Override
	public float readSensor(String sm, String platform, String sensor) {
		float value=0.0f;
		for(Platform pf : this.sm.getAllPlatforms()){
			if(pf.getName().equals(platform)){
				
				//Here we have to read sensors measurement from ESP8226
				value = 0;
			}
		}
		HTTPPost request = new HTTPPost();
		request.setDestinator(IP_MN+"/in-name/"+sm+"/"+platform+"/"+sensor);
		request = new HTTPPost();
		request.setDestinator(IP_MN+"/in-name/"+sm+"/"+platform+"/"+sensor);
		request.addHeader("X-M2M-Origin", "admin:admin");
		request.addHeader("Content-Type", "application/xml;ty=4");
		ContentInstance cin = new ContentInstance();
		cin.setContent(String.valueOf(value));
		request.setBody(Serializer.toXML(cin));
		request.send();
		return value;
	}
	
}
