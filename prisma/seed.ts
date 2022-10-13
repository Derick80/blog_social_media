import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'


const prisma = new PrismaClient()

async function seed() {
  const email = 'iderick@gmail.com'

  // cleanup the existing database
  await prisma.user.delete({ where: { email: email } }).catch(() => {
    // no worries if it doesn't exist yet
  })

  await prisma.user.delete({ where: { email: 'boston@gmail.com' } }).catch(() => {
    // no worries if it doesn't exist yet
  })
  await prisma.user.delete({ where: { email: 'chicago@gmail.com' } }).catch(() => {
    // no worries if it doesn't exist yet
  })
const hashedPassword = (await process.env.HASHEDPASSWORD) as string
const hashedPasswordUserTwo = (await process.env.HASHEDPASSWORDUSERTWO) as string
const hashedPasswordUserThree = (await process.env.HASHEDPASSWORDUSERTHREE) as string

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName: 'Derick',
      lastName:'Hoskinson',
      role: 'ADMIN'
    }
  })

  const userTwo = await prisma.user.create({
    data: {
      email: 'boston@gmail.com',
      password: hashedPasswordUserTwo,
      firstName: 'Boston',
      lastName: 'Hoskinson',
      role: 'USER'
    }
  })

  const userThree = await prisma.user.create({
    data: {
      email: 'chicago@gmail.com',
      password: hashedPasswordUserThree,
      firstName: 'Boston',
      lastName: 'Hoskinson',
      role: 'ADMIN'
    }
  })

  await prisma.profile.create({
    data: {
      user: { connect: { id: user.id } },
      email: user.email,
      firstName: 'Derick',
      lastName: 'Hoskinson',
			title:'Senior Clinical Scientist',
      bio: 'I am a senior clinical geneticist and a newbie software developer',
      currentLocation: 'Chicago',
      occupation: 'scientist',
      pronouns: 'HE',
      profilePicture: 'https://blogphotosbucket.s3.us-east-2.amazonaws.com/profileimages/DerickFace.jpg'
    }
  })

  await prisma.miniPost.create({
    data: {
      title:'My First Post',
      body:'This is my first post',
      userId: user.id,
      published: false,
     categories: {
        connectOrCreate: [
          {
            where: { name: 'TagResearch' },
            create: { name: 'TagResearch' }
          },
          {
            where: { name: 'TagBuilding' },
            create: { name: 'TagBuilding' }
          }
        ]
      }
    }

  })

  const post1 = await prisma.post.create({
    data: {
      title: 'Coordination of cleavage and polyadenylation with transcription',
      description:`Association of factors with the CTD of RNAP II facilitates the transcription of genes. The C-terminal domain (CTD) of Rbp1, the largest subunit of RNAP II, is a tail-like structure built of 26 heptad repeats in yeast and 52 in humans, and contains the consensus sequence Y1-S2-P3-T4-S5-P6-S7 (West & Corden 1995.).`,
      body: `Association of factors with the CTD of RNAP II facilitates the transcription of genes.
	The C-terminal domain (CTD) of Rbp1, the largest subunit of RNAP II, is a tail-like structure built of 26 heptad repeats in yeast and 52 in humans, and contains the consensus sequence Y1-S2-P3-T4-S5-P6-S7 (West & Corden 1995.).  The CTD acts as a binding platform for numerous proteins during transcription.  The interaction of these proteins with the CTD is controlled by the dynamic phosphorylation of particular residues during each stage of transcription (Buratowski 2003).
	Tyrosine 1, serine 2, threonine 4, serine 5, and serine 7 are differentially phosphorylated during the transcription cycle.  During the first round of transcription, a hypophosphorylated RNAP II is recruited into the pre-initiation complex.  During transcription initiation, the levels of serine 5 phosphorylation are highest and have been shown to recruit mRNA capping enzymes (McCracken et al. 1997; Cho et al. 1997; Komarnitsky et al. 2000).  Tyrosine 1 phosphorylation stimulates the recruitment of transcription elongation factors such as TREX (transcription and export machinery) and inhibits the recruitment of termination factors such as Nrd1, Rtt103, and Pcf11 (Mayer et al. 2012).  During the elongation phase, serine 2 phosphorylation levels increase steadily, and serine 5 levels gradually decrease, but do not entirely disappear at the 3’ end of the gene.  Just past the 3’ end of the gene, serine 2 phosphorylation decreases.  Phosphorylation of serine 7 is variable, but in general spikes of serine 7 phosphorylation are observed at the 5’ end of introns, which may suggest that serine 7 phosphorylation plays a role in the co-transcriptional recruitment of splicing factors (H. Kim et al. 2010; Mayer et al. 2010; Komarnitsky et al. 2000).
	During late elongation, the rise in the levels of serine 2 phosphorylation corresponds to the recruitment of 3’ end processing factors.  The N-terminus of the 3’ end processing subunit, Pcf11, contains a C-terminal interaction domain (CID) that interacts with the CTD of RNAP II, and this region is conserved from yeast to humans.  The CID interaction with the CTD is not required for in vitro processing but is more likely to be important in vivo where the association with the CTD of RNAP II and the CID of Pcf11 aid in the co-transcriptional recruitment of 3’ end processing factors (Graber et al. 2013; Gu et al. 2013; He, 2003; Licatalosi et al. 2002; Sadowski et al. 2003).
	Structurally, the CID of Pcf11 contains eight alpha helices arranged in a right-handed superhelical orientation and a hydrophobic groove that interact with the CTD of RNAP II through an induced fit rather than a conformational change (Noble et al. 2005).  Interestingly, the CID of Pcf11 does not directly contact the serine 2 residues on the CTD of RNAP II although additional binding studies revealed that the CID interaction with the CTD is enhanced upon serine 2 phosphorylation (Licatalosi et al. 2002).  Together these results suggest that Pcf11 may bind more strongly to the CTD when it is phosphorylated at serine 2, but in general Pcf11 binds the CTD even when phospho-serine 2 levels are not high.  In fact, this may explain the observation from genome wide analysis that placed Pcf11 at both the 5’ and 3’ ends of genes.  Additional interactions with either RNAP II or co-factors may also help recruit Pcf11 to genes.
	In vitro experiments have demonstrated that Pcf11 aids in the disassembly of elongation complexes by binding the CTD of RNAP II and the nascent RNA transcript (Zhang et al. 2005). Once Pcf11 has been recruited to the CTD of RNAP II, it can help recruit 3’ end processing subunits and transcription termination factors, including Rna14, Rna15, Cft1, Cft2, and Rat1 to the pre-mRNA (Ahn et al. 2009; Amrani et al., 1997; Peterlin & Price, 2006; Qiu et al. 2009).  Once these factors have localized to the 3’ end of the pre-mRNA, the cleavage and polyadenylation reaction is catalyzed, and RNAP II transcription is terminated.`,
      postImg: 'https://blogphotosbucket.s3.us-east-2.amazonaws.com/postimages/post_one_prisma_schema.png',
      createdBy: user.firstName,
      userId: user.id,
      published: true,
      likes: {
        create: [
          { userId: userTwo.id },
          { userId: userThree.id }
        ]
      },
     categories: {
        connectOrCreate: [
          {
            where: { name: 'Yeast' },
            create: { name: 'Yeast' }
          },
          {
            where: { name: 'Transcription' },
            create: { name: 'Transcription' }
          }
        ]
      }
    }
  })

const post2 = await prisma.post.create({
    data: {
      title: 'Transcription termination by RNAP II is facilitated by 3’ end processing factors.',
      description: `Transcription termination by RNAP II is facilitated by 3’ end processing factors. RNAP II transcription termination is the process by which RNAP II is released from the DNA at the end of a transcribed gene`,
      body: `Transcription termination by RNAP II is facilitated by 3’ end processing factors.
	RNAP II transcription termination is the process by which RNAP II is released from the DNA at the end of a transcribed gene, so that it may then be used for subsequent rounds of transcription. Transcription termination occurs at all genes that are transcribed by RNAP II including those encoding snRNA genes and mRNAs.  Proper transcription termination is important for the generation of functional transcripts and relies on the presence of signals on the RNA as well as 3’ end processing factors such as Pcf11 (Buratowski 2005; Proudfoot et al. 2002; Rosonina et al. 2006).  Failure of RNAP II to properly terminate transcription can be detrimental to the cell due to transcriptional readthrough into the promoter of downstream genes, into centromeres, or into origins of replication. Additionally, lack of proper termination may lead to anti-sense RNA transcription and gene silencing (Greger & Proudfoot 1998; J Eggermont 1993; Kuehner et al. 2011).  Yeast employs two primary forms of transcription termination for RNAP II, which are described below.`,
      postImg: 'https://blogphotosbucket.s3.us-east-2.amazonaws.com/postimages/post_two_memory_game.png',
      userId: user.id,
      createdBy: user.firstName,
      published: true,

      likes: {
        create: [
          { userId: userTwo.id },
          { userId: userThree.id }
        ]
      },
     categories: {
        connectOrCreate: [
          {
            where: { name: 'Genetics' },
            create: { name: 'Genetics' }
          },
          {
            where: { name: 'mRNA' },
            create: { name: 'mRNA' }
          }
        ]
      }
    }
  })
  const post3 = await prisma.post.create({
    data: {
      title: 'Poly(A) dependent transcription termination',
      description: `On long mRNA genes (greater than 1kb in yeast), the recruitment of termination factors is linked to the phosphorylation of Ser2 of the CTD of RNAP II`,
      body: `On long mRNA genes (greater than 1kb in yeast), the recruitment of termination factors is linked to the phosphorylation of Ser2 of the CTD of RNAP II, recruitment of a number of 3’ end processing subunits and recruitment of Rat1, a 5’ to 3’ single strand RNA endonuclease, and its associated proteins, Rtt103 and Rai1 (Amrani et al., 1997; Gross & Moore, 2001; Kim et al., 2004; Livak & Schmittgen, 2001; West et al. 2004). Currently, there are three models of poly(A)-dependent transcription termination: the torpedo model, the allosteric model, and the hybrid model.  The torpedo model for transcription termination places Rat1 (human XRN1), a 5’ to 3’ exoribonuclease, as the primary termination factor.  It is thought that after cleavage of the nascent mRNA, Rat1 acts to ‘bump’ off RNAP II from the nucleic acid framework as it degrades the uncapped, downstream RNA product of cleavage.  Evidence against the torpedo model comes from several observations. First, degradation of the cleaved, nascent RNA by a similar cytoplasmic nuclease, Xrn1 that is artificially targeted to the nucleus was not enough to result in termination (Luo et al. 2006). Rat1 is sufficient for the release of stalled polymerase complexes in vitro, but the release activity of a catalytically dead Rat1 mutant can be partially rescued by the inclusion of Rtt103, which helps recruit Rat1 to the CTD (Nedea et al. 2003; Pearson & Moore, 2013).  Additionally, some mutants of Ssu72 are defective for cleavage but do not affect transcription termination (Dichtl et al. 2002; He 2003; Sadowski et al. 2003).`,
      postImg: 'https://blogphotosbucket.s3.us-east-2.amazonaws.com/postimages/post_three_yeast_plates.jpeg',
      createdBy: user.firstName,
      published: true,

      userId: user.id,
     categories: {
        connectOrCreate: [
          {
            where: { name: 'Graduate School' },
            create: { name: 'Graduate School' }
          },
          {
            where: { name: 'genes' },
            create: { name: 'genes' }
          }
        ]
      }
    }
  })
  await prisma.post.create({
    data: {
      title: 'Production of mature mRNA is a multistep process requiring many proteins that is essential for proper cellular function',
      description: `Defects in mRNA maturation lead to radical changes in development, growth and viability of the cell.  `,
      body: `Production of mature mRNA is a multistep process requiring many proteins that is essential for proper cellular function.  Defects in mRNA maturation lead to radical changes in development, growth and viability of the cell.  The essential mRNA 3’ end processing subunit, Pcf11, is required for the cleavage and polyadenylation of nascent mRNAs and for proper termination of RNA polymerase II transcription.  Pcf11 also plays a role in alternative polyadenylation.  Previous work has identified and described the function of several domains in the Pcf11 protein, but the crystal structure has not been solved and there remain large stretches of Pcf11 that are uncharacterized.  Pcf11 is part of the CF 1A factor involved in cleavage and polyadenylation.  As part of CF 1A, Pcf11 makes contacts with each of the other CF 1A protein subunits as well as several of the protein subunits that make up the Cleavage and Polyadenylation Factor (CPF), but the importance of these cross-factor interactions is not known.  Pcf11 and other mRNA 3’ end processing subunits have been primarily studied in the context of RNA polymerase II transcription and mRNA processing but there are indications that mRNA processing subunits participate in other aspects of RNA maturation such as tRNA `,
      postImg: 'https://blogphotosbucket.s3.us-east-2.amazonaws.com/postimages/post_three_yeast_plates.jpeg',
      userId: user.id,
      createdBy: user.firstName,
      published: true,

     categories: {
        connectOrCreate: [
          {
            where: { name: 'Graduate School' },
            create: { name: 'Graduate School' }
          },
          {
            where: { name: 'genes' },
            create: { name: 'genes' }
          }
        ]
      }
    }
  })

  await prisma.post.create({
    data: {
      title: 'Models for the role of Pcf11',
      description: `recruitment of Pcf11 to promoter-proximal poly(A) sites is reduced in pcf11 ∆142-225 due to deficits in important protein-protein interactions and may result in suppression of termination at the promoter-proximal site in favor of termination at the distal poly(A) site.`,
      body: ` In the following section I will describe several models for Pcf11 function.  In the first model, I argue that recruitment of Pcf11 to promoter-proximal poly(A) sites is reduced in pcf11 ∆142-225 due to deficits in important protein-protein interactions and may result in suppression of termination at the promoter-proximal site in favor of termination at the distal poly(A) site.  In the second model, I argue that deletion of amino acids 142-225 increases the speed of RNAP II, resulting in shorter species of readthrough transcripts.  Then I present a model in which enhancement of gene looping at some RNAs could explain the increase of RNAs that I observed in pcf11 ∆142-225.  Another model that will be discussed is one in which RNAP II occupancy at some genes may be increased in pcf11 ∆142-225 which may explain why some genes were upregulated in pcf11 ∆142-225 compared to wild-type.  Then, I discuss a model in which pcf11 ∆142-225 more efficiently processes precursor RNAs.  Finally, I also consider a model in which alteration of the stability of mRNA in pcf11 ∆142-225 might explain the changes in gene expression that I have observed.  `,
      postImg: 'https://blogphotosbucket.s3.us-east-2.amazonaws.com/postimages/post_three_yeast_plates.jpeg',
      userId: user.id,
      createdBy: user.firstName,
      published: true,

     categories: {
        connectOrCreate: [
          {
            where: { name: 'Graduate School' },
            create: { name: 'Graduate School' }
          },
          {
            where: { name: 'genes' },
            create: { name: 'genes' }
          }
        ]
      }
    }
  })

  await prisma.post.create({
    data: {
      title: 'mRNA maturation',
      description:`If intron-containing mRNAs escape to the cytoplasm, they are degraded via nonsense mediated decay (NMD) or NMD-independent degradation pathways (Aguilera, 2005; Bentley, 2014).`,
      body: `Many genes, if not most, in higher organisms contain non-coding, intervening DNA sequences called introns, between the protein-coding exon portions of the gene.  The second major step in mRNA maturation is the removal of introns and the splicing of exons.  Introns are removed from the pre-mRNA by the spliceosome components in a two step reaction that ends in the joining of two exons together (Bentley 2014).  Most metazoan genes have numerous introns while very few genes in yeast have introns.  The selection of which exons are included in the final mRNA has lead to a diversification of gene products such that one gene can code for numerous different mRNA isoforms, each of which may have unique functions.  Chromatin modifications and differential phosphorylation of the CTD of RNAP II play an active role in the recruitment of splicing factors, and the splicing reaction itself may occur prior to or following the cleavage and polyadenylation step of mRNA maturation (Bentley 2014; Rigo & Martinson 2009; Oesterreich et al. 2011; David & Manley 2011).`,
      postImg: 'https://remix-bucket.s3.us-east-2.amazonaws.com/post_one_prisma_schema.png',
      userId: userTwo.id,
      createdBy: userTwo.firstName,
      published: true,

     categories: {
        connectOrCreate: [
          {
            where: { name: 'Genetics' },
            create: { name: 'Genetics' }
          },
          {
            where: { name: 'Yeast' },
            create: { name: 'Yeast' }
          }
        ]
      }
    }
  })


  await prisma.post.create({
    data: {
      title: 'mRNA maturation',
      description: `Introns are removed from the pre-mRNA by the spliceosome components in a two step reaction that ends in the joining of two exons together `,
      body: `Many genes, if not most, in higher organisms contain non-coding, intervening DNA sequences called introns, between the protein-coding exon portions of the gene.  The second major step in mRNA maturation is the removal of introns and the splicing of exons.  Introns are removed from the pre-mRNA by the spliceosome components in a two step reaction that ends in the joining of two exons together (Bentley 2014).  Most metazoan genes have numerous introns while very few genes in yeast have introns.  The selection of which exons are included in the final mRNA has lead to a diversification of gene products such that one gene can code for numerous different mRNA isoforms, each of which may have unique functions.  Chromatin modifications and differential phosphorylation of the CTD of RNAP II play an active role in the recruitment of splicing factors, and the splicing reaction itself may occur prior to or following the cleavage and polyadenylation step of mRNA maturation (Bentley 2014; Rigo & Martinson 2009; Oesterreich et al. 2011; David & Manley 2011).  mRNAs that contain introns that are not properly spliced are recognized by the mRNA surveillance complex, TRAMP (Trf4/Air2/Mtr4p Polyadenylation), and degraded by the nuclear exosome.  If intron-containing mRNAs escape to the cytoplasm, they are degraded via nonsense mediated decay (NMD) or NMD-independent degradation pathways (Aguilera, 2005; Bentley, 2014).
      `,
      postImg: 'https://remix-bucket.s3.us-east-2.amazonaws.com/lab.jpeg',
      userId: userTwo.id,
      createdBy: userTwo.firstName,
      published: true,

     categories: {
        connectOrCreate: [
          {
            where: { name: 'Genetics' },
            create: { name: 'Genetics' }
          },
          {
            where: { name: 'Yeast' },
            create: { name: 'Yeast' }
          }
        ]
      }
    }
  })
  await prisma.post.create({
    data: {
      title: 'PS1 Same amino acid change',
      description: `In most cases, when one missense variant is known to be pathogenic, a different nucleotide change that results in the same amino acid [e.g. c.34G>C (p.Val12Leu) and c.34G>T (p.Val12Leu)] can also be assumed to be pathogenic`,
      body:'particularly if the mechanism of pathogenicity is through altered protein function. However, it is important to assess the possibility that the variant may act directly through the specific DNA change (e.g. through splicing disruption as assessed through at least computational analysis) instead of through the amino acid change, in which case the assumption of pathogenicity may no longer be valid.',
      postImg: 'https://remix-bucket.s3.us-east-2.amazonaws.com/Screen%20Shot%202022-10-02%20at%201.12.08%20PM.png',
      userId: user.id,
      createdBy: user.firstName,
      published: false,

     categories: {
        connectOrCreate: [
          {
            where: { name: 'Variant Annotation' },
            create: { name: 'Variant Annotation' }
          },
          {
            where: { name: 'Clinical Genetics' },
            create: { name: 'Clinical Genetics' }
          }
        ]
      }
    }
  })
  await prisma.post.create({
    data: {
      title: 'Transcription termination by RNAP II is facilitated by 3’ end processing factors.',
      description: `Transcription termination by RNAP II is facilitated by 3’ end processing factors. RNAP II transcription termination is the process by which RNAP II is released from the DNA at the end of a transcribed gene`,
      body: `Transcription termination by RNAP II is facilitated by 3’ end processing factors.
	RNAP II transcription termination is the process by which RNAP II is released from the DNA at the end of a transcribed gene, so that it may then be used for subsequent rounds of transcription. Transcription termination occurs at all genes that are transcribed by RNAP II including those encoding snRNA genes and mRNAs.  Proper transcription termination is important for the generation of functional transcripts and relies on the presence of signals on the RNA as well as 3’ end processing factors such as Pcf11 (Buratowski 2005; Proudfoot et al. 2002; Rosonina et al. 2006).  Failure of RNAP II to properly terminate transcription can be detrimental to the cell due to transcriptional readthrough into the promoter of downstream genes, into centromeres, or into origins of replication. Additionally, lack of proper termination may lead to anti-sense RNA transcription and gene silencing (Greger & Proudfoot 1998; J Eggermont 1993; Kuehner et al. 2011).  Yeast employs two primary forms of transcription termination for RNAP II, which are described below.`,
      postImg: 'https://blogphotosbucket.s3.us-east-2.amazonaws.com/postimages/post_two_memory_game.png',
      userId: user.id,
      createdBy: user.firstName,
      published: false,

      likes: {
        create: [
          { userId: userTwo.id },
          { userId: userThree.id }
        ]
      },
     categories: {
        connectOrCreate: [
          {
            where: { name: 'Music' },
            create: { name: 'Music' }
          },
          {
            where: { name: 'mRNA' },
            create: { name: 'mRNA' }
          }
        ]
      }
    }
  })

  await prisma.post.create({
    data: {
      title: 'Transcription termination by RNAP II is facilitated by 3’ end processing factors.',
      description: `Transcription termination by RNAP II is facilitated by 3’ end processing factors. RNAP II transcription termination is the process by which RNAP II is released from the DNA at the end of a transcribed gene`,
      body: `Transcription termination by RNAP II is facilitated by 3’ end processing factors.
	RNAP II transcription termination is the process by which RNAP II is released from the DNA at the end of a transcribed gene, so that it may then be used for subsequent rounds of transcription. Transcription termination occurs at all genes that are transcribed by RNAP II including those encoding snRNA genes and mRNAs.  Proper transcription termination is important for the generation of functional transcripts and relies on the presence of signals on the RNA as well as 3’ end processing factors such as Pcf11 (Buratowski 2005; Proudfoot et al. 2002; Rosonina et al. 2006).  Failure of RNAP II to properly terminate transcription can be detrimental to the cell due to transcriptional readthrough into the promoter of downstream genes, into centromeres, or into origins of replication. Additionally, lack of proper termination may lead to anti-sense RNA transcription and gene silencing (Greger & Proudfoot 1998; J Eggermont 1993; Kuehner et al. 2011).  Yeast employs two primary forms of transcription termination for RNAP II, which are described below.`,
      postImg: 'https://blogphotosbucket.s3.us-east-2.amazonaws.com/postimages/post_two_memory_game.png',
      userId: user.id,
      createdBy: user.firstName,
      published: false,

      likes: {
        create: [
          { userId: userTwo.id },
          { userId: userThree.id }
        ]
      },
     categories: {
        connectOrCreate: [
          {
            where: { name: 'Gaming' },
            create: { name: 'Gaming' }
          },
          {
            where: { name: 'Prisma' },
            create: { name: 'Prisma' }
          }
        ]
      }
    }
  })
  console.log(`Database has been seeded. 🌱`)
}

seed()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

