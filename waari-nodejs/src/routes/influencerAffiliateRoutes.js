const { Router } = require("express");
const influencerAffiliateController = require("../controllers/influencerAffiliateController");

const router = Router();

router.get("/list-influencer-affiliate", influencerAffiliateController.listInfluencerAffiliates);
router.post("/add-influencer-affiliate", influencerAffiliateController.addInfluencerAffiliate);
router.get("/view-influencer-affiliate", influencerAffiliateController.viewInfluencerAffiliate);
router.post(
  "/update-info-influencer-affiliate",
  influencerAffiliateController.updateInfluencerAffiliate
);
router.get("/delete-influencer-affiliate", influencerAffiliateController.deleteInfluencerAffiliate);

module.exports = router;
