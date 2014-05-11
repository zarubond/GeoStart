package com.zarubond.geostar;


import java.util.ArrayList;
import java.util.List;

import javax.jdo.annotations.Extension;
import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

import com.google.appengine.api.datastore.Key;
import com.google.appengine.labs.repackaged.org.json.JSONObject;
/**
 * Game player model
 * @author Ondreaj Zaruba
 *
 */

@PersistenceCapable
public class Player {
    @PrimaryKey
    @Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
    private Key key;
    
    @Persistent
    @Extension(vendorName="datanucleus", key="gae.unindexed", value="true")
    public List<Shot> shotList=new ArrayList<Shot>();

    /**
     * pos_x,pos_y,target_x,target_y
     */
	@Persistent
	@Extension(vendorName="datanucleus", key="gae.unindexed", value="true")
	public float[] data=new float[4];
	/**
	 * last update
	 */
	@Persistent
	@Extension(vendorName="datanucleus", key="gae.unindexed", value="true")
	public long timestamp;
	/**
	 * Communication key
	 */
	@Persistent
	@Extension(vendorName="datanucleus", key="gae.unindexed", value="true")
	public String channelKey;
	/**
	 * number of deaths
	 */
	@Persistent
	@Extension(vendorName="datanucleus", key="gae.unindexed", value="true")
	public int died=0;
	/**
	 * number of kills
	 */
	@Persistent
	@Extension(vendorName="datanucleus", key="gae.unindexed", value="true")
	public int killed=0;
	/**
	 * unique player id
	 */
	@Persistent
	@Extension(vendorName="datanucleus", key="gae.unindexed", value="true")
	public int id;
	/**
	 * is death?
	 */
	@Persistent
	@Extension(vendorName="datanucleus", key="gae.unindexed", value="true")
	public boolean death=false;
	
	//shots
}
