'use strict';


/**
 * Undo all set up for testing
   * @param {org.acme.electronicPartsNetwork.undoSetup} undoSetup - the
  * @transaction
  */
function undoSetup(undoSetup) {
  var NS = 'org.acme.electronicPartsNetwork';

  return getParticipantRegistry(NS + '.OriginalComponentManufacturer')
      .then(function (ocmRegistry) {
        return ocmRegistry.getAll().then(function (ocms) {
          // remove the OCMs
//          return ocmRegistry.removeAll(['ocm3@email.com', 'ocm4@email.com']);
          if (ocms.length >= 1 ) {
          ocmRegistry.removeAll(ocms);
        }
          })
        })
      .then(function() {
          return getParticipantRegistry(NS + '.Buyer');
        })
      .then(function(buyerRegistry) {
          // remove the buyers
          return buyerRegistry.getAll().then(function (buyers) {
            if (buyers.length >= 1 ) {
            buyerRegistry.removeAll(buyers);
          }
          })
        })
      .then(function() {
            return getAssetRegistry(NS + '.PurchaseOrder');
          })
      .then(function(poRegistry) {
            // remove the POs
            return poRegistry.getAll().then(function (pos) {
              if (pos.length >= 1 ) {
              poRegistry.removeAll(pos);
            }
            })
          })
      .then(function() {
                return getAssetRegistry(NS + '.ElectronicPart');
              })
      .then(function(epRegistry) {
            // remove the parts
            return epRegistry.getAll().then(function (eps) {
              if (eps.length >= 1 ) {
              epRegistry.removeAll(eps);
            }
            })
          })
      .then(function() {
              return getAssetRegistry(NS + '.Shipment');
            })
      .then(function(shipmentRegistry) {
                // remove the parts
            return shipmentRegistry.getAll().then(function (shipments) {
              if (shipments.length >= 1 ) {
                  shipmentRegistry.removeAll(shipments);
                }
              })
          })
          .then(function() {
                  return getAssetRegistry(NS + '.ElectronicPartInventory');
                })
          .then(function(epInvRegistry) {
                    // remove the parts
                return epInvRegistry.getAll().then(function (epInvParts) {
                  if (epInvParts.length >= 1 ) {
                      epInvRegistry.removeAll(epInvParts);
                    }
                  })
              })
      .catch(function (error) {
        console.log(error.message);
      });
}

/**
 * Initialize some test assets and participants useful for running a demo.
 * @param {org.acme.electronicPartsNetwork.setupDemo} setupDemo - the SetupDemo transaction
 * @transaction
 */
function setupDemo(setupDemo) {

    var factory = getFactory();
    var NS = 'org.acme.electronicPartsNetwork';
    var ocms = [];
    var buyers = [];

    // create the ocm
    var ocm = factory.newResource(NS, 'OriginalComponentManufacturer', 'ocm@email.com');
    var ocmAddress = factory.newConcept(NS, 'Address');
    ocmAddress.country = 'USA';
    ocm.address = ocmAddress;
    ocm.accountBalance = 0;
    ocms.push(ocm);

    // create the buyer
    var buyer = factory.newResource(NS, 'Buyer', 'buyer@email.com');
    var buyerAddress = factory.newConcept(NS, 'Address');
    buyerAddress.country = 'USA';
    buyer.address = buyerAddress;
    buyer.accountBalance = 100;
    buyers.push(buyer);

    // create the Purchase Order
    var pos = [];
    var po = factory.newResource(NS, 'PurchaseOrder', 'PO_001');
    po.seller = factory.newRelationship(NS, 'OriginalComponentManufacturer', 'ocm@email.com');
    po.buyer = factory.newRelationship(NS, 'Buyer', 'buyer@email.com');
    po.unitPrice = 50; // pay $50 per unit
    po.unitCount = 1;
    po.orderedPartNum = 'A2000';
    po.complianceChecksOutcome = "Not performed yet";
    po.status = "Issued";
    pos.push(po);

    //create the electronic part
    var eparts = [];
    var epart = factory.newResource(NS, 'ElectronicPart', 'SN_001');
    epart.partNum = po.orderedPartNum;
    epart.partType = 'COMPONENT';
    epart.productionBatchNumber = "LOT_001";
    epart.manufactureDate = Date();
    epart.obsolescenceDate = 'Oct 2025';
    epart.ocm = factory.newRelationship(NS,'OriginalComponentManufacturer', 'ocm@email.com');
    epart.ownerEmail = ocm.email;
    epart.qaTests = [];
    eparts.push(epart);


//create the qaTesting for the part
  var qaTest = factory.newConcept(NS, 'QATest');
  qaTest.testID = 'QA_001';
  qaTest.testType = 'Visual Inspection';
  qaTest.testPerformedDate = Date();
  qaTest.testOutcome = 'Passed';
  qaTest.Inspector = 'QA Inspector1';
  qaTest.originalRecordURL = 'www.acmeQATestingDoc';
  epart.qaTests.push(qaTest);

  var qaTest2 = factory.newConcept(NS, 'QATest');
  qaTest2.testID = 'QA_002';
  qaTest2.testType = 'Vibration Tests';
  qaTest2.testPerformedDate = Date();
  qaTest2.testOutcome = 'Passed';
  qaTest2.Inspector = 'QA Inspector1';
  qaTest2.originalRecordURL = 'www.acmeQATestingDoc';
  epart.qaTests.push(qaTest2);

  // create the shipment
  var shipments = []; //array in case want to create >1 shipments
  var shipment = factory.newResource(NS, 'Shipment', 'SHIP_001');
  shipment.status = 'CREATED';
  shipment.unitCount = 100;
  var shipAddress = factory.newConcept(NS, 'Address');
  shipAddress.country = 'USA';
  shipment.shippingAddress = shipAddress;
  shipment.certificateOfConformance = "I certify to conform to buyer specs.  Signed..."
  shipment.purchaseOrder = factory.newRelationship(NS,'PurchaseOrder', 'PO_001');
  //shipment.shippedParts = eparts;   //TODO: change this to pointer
  shipment.shippedParts = [];
  shipment.shippedParts.push(eparts[0]);
  shipment.shippedParts[0] = factory.newRelationship(NS,'ElectronicPart', eparts[0].serNumId);
  shipments.push(shipment);


    return getParticipantRegistry(NS + '.OriginalComponentManufacturer')
      .then(function (ocmRegistry) {
            // add the ocms
            return ocmRegistry.addAll(ocms);
        })
      .then(function() {
          return getParticipantRegistry(NS + '.Buyer');
        })
      .then(function(buyerRegistry) {
          // add the buyers
          return buyerRegistry.addAll(buyers);
        })
      .then(function() {
            return getAssetRegistry(NS + '.PurchaseOrder');
        })
      .then(function(purchaseOrderRegistry) {
            // add the contracts
            return purchaseOrderRegistry.addAll(pos);
        })
     .then(function() {
            return getAssetRegistry(NS + '.ElectronicPart');
        })
      .then(function(electronicPartRegistry) {
            // add the parts
            return electronicPartRegistry.addAll(eparts);
        })
      .then(function() {
               return getAssetRegistry(NS + '.Shipment');
           })
       .then(function(shipmentRegistry) {
               // add the shipments
             return shipmentRegistry.addAll(shipments);
          })
      .catch(function (error) {
          console.log(error.message);
        });

}

/**
 * A Shipment has been shipped
   * @param {org.acme.electronicPartsNetwork.shipmentShipped} shipmentShipped - the ShipmentShipped
  * @transaction
  */
function shipmentShipped(shipmentShipped) {
  shipmentShipped.shipment.status = 'IN_TRANSIT';
  console.log('shipment status: ' + shipmentShipped.shipment.status);

  return getAssetRegistry('org.acme.electronicPartsNetwork.Shipment')
  .then(function (shipmentRegistry) {
    //update state of shipment in registry
    return shipmentRegistry.update(shipmentShipped.shipment);
  });
}

/**
 * A Shipment has been received and counterfeiting policy compliance checked
   * @param {org.acme.electronicPartsNetwork.shipmentReceived} shipmentReceived - the ShipmentReceived
  * @transaction
  */
function shipmentReceived(shipmentReceived) {

  var shipPO = shipmentReceived.shipment.purchaseOrder.purchaseOrderId;
  //note: this artificially assumes only check first of shipped parts
  var shippedPartNum = shipmentReceived.shipment.shippedParts[0].partNum;
  var orderedPartNum = shipmentReceived.shipment.purchaseOrder.orderedPartNum;
  var poSeller = shipmentReceived.shipment.purchaseOrder.seller;
  var poBuyer = shipmentReceived.shipment.purchaseOrder.buyer;
  var epOCM = shipmentReceived.shipment.shippedParts[0].ocm;
  var shippedEp = shipmentReceived.shipment.shippedParts[0];
  var epQATestArray = shipmentReceived.shipment.shippedParts[0].qaTests
  var poCreditDebit = (shipmentReceived.shipment.purchaseOrder.unitPrice * shipmentReceived.shipment.purchaseOrder.unitCount)
  var isCompliant
  console.log('shipment status: ' + shipmentReceived.shipment.status);

//Check against anti-counterfeiting policy
var complianceOutcomesMsg
var poStatus
if (shippedPartNum !== orderedPartNum) {    //ordered part = received part
  isCompliant = false;
  complianceOutcomesMsg = "Received part number doesn't match ordered part number.";
} else if (poSeller !== epOCM) {   //seller is OCM
  isCompliant = false;
  complianceOutcomesMsg = 'Seller is not the OCM.';
} else if (shipmentReceived.shipment.certificateOfConformance.search('Signed') == -1) { //signed Cert of Conform
   isCompliant = false;
   complianceOutcomesMsg = 'No signed Certificate of Conformance.';
} else if (epQATestArray[0].testOutcome !== 'Passed') {
  isCompliant = false;
  complianceOutcomesMsg = 'QA tests failed.';
} else {
  isCompliant = true;
  complianceOutcomesMsg = 'Received parts comply with anti-counterfeiting policy.';
}
var complianceChecksOutcome

if (isCompliant) {
  complianceChecksOutcome = "Passed";
  poStatus = "Paid";  //TODO: this should be after the credits/debits applied
  shipmentReceived.shipment.status = "ACCEPTED";
} else {
  complianceChecksOutcome = "Failed";
  poStatus = "Failed to satisfy terms - no payment";
  shipmentReceived.shipment.status = "REJECTED";
}
//Get the corresponding purchase order asset to update it
//Note how this uses nested promises in order to access poRegistry again after finding it in order to update it
  getAssetRegistry('org.acme.electronicPartsNetwork.PurchaseOrder')
  .then(function (poRegistry) {
    return poRegistry.get(shipPO).then(function (po) {
      po.complianceChecksOutcome = complianceChecksOutcome;
      po.complianceNotes = complianceOutcomesMsg;
      po.status = poStatus;
      poRegistry.update(po);
    })
  })
  .catch(function (error) {
      console.log(error);
  });

//if compliant, then credit/debit amount and update owner of epart
if (isCompliant) {
  getParticipantRegistry('org.acme.electronicPartsNetwork.Buyer')
  .then(function (buyerRegistry) {
    //update state of shipment in registry
    return buyerRegistry.get(poBuyer.email).then(function (rscBuyer) {
      var newBalance = rscBuyer.accountBalance - poCreditDebit;
      rscBuyer.accountBalance = newBalance;
      buyerRegistry.update(rscBuyer);
  })
})
.catch(function (error) {
  console.log(error);
});
}  //endif

if (isCompliant) {
getParticipantRegistry('org.acme.electronicPartsNetwork.OriginalComponentManufacturer')
.then(function (sellerRegistry) {
  //update state of shipment in registry
  return sellerRegistry.get(poSeller.email).then(function (rscSeller) {
    var newBalance = rscSeller.accountBalance + poCreditDebit;
    rscSeller.accountBalance = newBalance;
    sellerRegistry.update(rscSeller);
  })
})
  .catch(function (error) {
    console.log(error);
});
}  //endif

if (isCompliant) {
    getAssetRegistry('org.acme.electronicPartsNetwork.ElectronicPart')
    .then(function (epRegistry) {
      return epRegistry.get(shippedEp.serNumId).then(function (ep) {
        ep.ownerEmail = poBuyer.email;
        epRegistry.update(ep);
    })
  })
    .catch(function (error) {
        console.log(error);
    });
  }

  return getAssetRegistry('org.acme.electronicPartsNetwork.Shipment')
  .then(function (shipmentRegistry) {
    //update state of shipment in registry
    return shipmentRegistry.update(shipmentReceived.shipment);
  });   //TODO:  add call to shipmentStored transaction for accepted shipments
}

/**
 * A Shipment has been stored in the warehouse and is ready for issue
   * @param {org.acme.electronicPartsNetwork.shipmentStored} shipmentStored - the ShipmentAccepted
  * @transaction
  */
function shipmentStored(shipmentStored) {
  shipmentStored.shipment.status = 'PLACED_IN_INVENTORY';
  console.log('shipment status: ' + shipmentStored.shipment.status);
//to do:  create/add inventory asset
  var factory = getFactory();
  var NS = 'org.acme.electronicPartsNetwork';
  var inventoryItem = factory.newResource(NS, 'ElectronicPartInventory', 'INV_001');
  inventoryItem.locationName = 'Warehouse 1';
  inventoryItem.stockedDate = Date();
  inventoryItem.partNumber = shipmentStored.shipment.shippedParts[0].partNum;
  inventoryItem.storedParts = [];
  inventoryItem.storedParts.push(shipmentStored.shipment.shippedParts[0]);
  inventoryItem.storedParts[0] = factory.newRelationship(NS, 'ElectronicPart', shipmentStored.shipment.shippedParts[0].serNumId);


  return getAssetRegistry(NS + '.ElectronicPartInventory')
      .then(function (invRegistry) {
          // add the inventory
          invRegistry.add(inventoryItem);
        })
      .then(function () {
        return getAssetRegistry('org.acme.electronicPartsNetwork.Shipment');
        })
      .then(function (shipmentRegistry) {
        //update state of shipment in registry
        return shipmentRegistry.update(shipmentStored.shipment);
        })
      .catch(function (error) {
          console.log(error.message);
      });
}
